// cv.service.ts
import { Injectable } from '@nestjs/common';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import sanitizeHtml from 'sanitize-html';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx';
import Handlebars from 'handlebars';

@Injectable()
export class CvService {
  // point to the template package by default
  public templateDir: string;
  private templatePath: string;

  constructor() {
    const candidates = [
      join(__dirname, '..', '..', 'templates'), // when running from src
      join(__dirname, '..', '..', '..', 'templates'), // when running from dist
      join(process.cwd(), 'backend', 'templates'), // explicit project path
      join(process.cwd(), 'templates'),
    ];
    this.templateDir = candidates.find((p) => existsSync(p)) || candidates[0];
    this.templatePath = join(this.templateDir, 'template.html');

    // register small helpers
    Handlebars.registerHelper('join', function (arr: any, sep: string) {
      if (!Array.isArray(arr)) return '';
      return arr.join(sep || ', ');
    });
    Handlebars.registerHelper('formatDate', function (iso: string) {
      try {
        const d = new Date(iso);
        return d.toLocaleDateString();
      } catch (e) {
        return iso;
      }
    });
  }

  renderHtml(payload: any) {
    const tpl = readFileSync(this.templatePath, 'utf8');
    const context = this.buildContext(payload);
    const template = Handlebars.compile(tpl);
    return template(context);
  }

  async generatePdf(payload: any) {
    const tpl = readFileSync(this.templatePath, 'utf8');
    const context = this.buildContext(payload);
    const template = Handlebars.compile(tpl);
    const htmlBody = template(context);

    // Wrap into full HTML doc with CSS
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <link rel="stylesheet" href="file://${join(this.templateDir, 'template.css')}" />
        </head>
        <body>
          ${htmlBody}
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('print');

    const pdfBuffer = await page.pdf({
      preferCSSPageSize: true,
      printBackground: true,
      format: 'A4',
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
    });

    await browser.close();
    return pdfBuffer;
  }

  async generateDocx(payload: any) {
    const tpl = readFileSync(this.templatePath, 'utf8');
    const context = this.buildContext(payload);
    const template = Handlebars.compile(tpl);
    const html = template(context);

    const safe = sanitizeHtml(html, {
      allowedTags: [
        'h1',
        'h2',
        'h3',
        'p',
        'ul',
        'ol',
        'li',
        'br',
        'strong',
        'b',
        'em',
        'i',
      ],
      allowedAttributes: {
        a: ['href'],
      },
    });

    const paragraphs: Paragraph[] = [];

    const pushTextParagraph = (text: string) => {
      const lines = text
        .split(/<br\s*\/?>/i)
        .map((s) => this.stripTags(s).trim())
        .filter(Boolean);
      for (const line of lines) {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: line })],
          }),
        );
      }
    };

    const headingRegex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
    let remaining = safe.replace(headingRegex, (_match, level, content) => {
      const text = this.stripTags(content).trim();
      if (text) {
        const headingLevel =
          level === '1'
            ? HeadingLevel.HEADING_1
            : level === '2'
              ? HeadingLevel.HEADING_2
              : HeadingLevel.HEADING_3;
        paragraphs.push(
          new Paragraph({
            text: text,
            heading: headingLevel,
          }),
        );
      }
      return '';
    });

    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    remaining = remaining.replace(liRegex, (_match, content) => {
      const text = this.stripTags(content).trim();
      if (text) {
        paragraphs.push(
          new Paragraph({
            text: text,
            bullet: { level: 0 },
          }),
        );
      }
      return '';
    });

    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    remaining = remaining.replace(pRegex, (_match, content) => {
      pushTextParagraph(content);
      return '';
    });

    const leftover = this.stripTags(remaining).trim();
    if (leftover) pushTextParagraph(leftover);

    const doc = new Document({
      sections: [
        { children: paragraphs.length ? paragraphs : [new Paragraph('')] },
      ],
    });
    const buffer = await Packer.toBuffer(doc);
    return buffer;
  }

  private injectTemplate(tpl: string, payload: any) {
    const safeExperience = sanitizeHtml(payload.experienceHtml || '', {
      allowedTags: [
        'p',
        'b',
        'i',
        'strong',
        'em',
        'ul',
        'ol',
        'li',
        'br',
        'h1',
        'h2',
      ],
      allowedAttributes: { a: ['href', 'target'] },
    });
    return tpl
      .replace(/{{fullName}}/g, this.escape(payload.fullName || ''))
      .replace(/{{jobTitle}}/g, this.escape(payload.jobTitle || ''))
      .replace(/{{email}}/g, this.escape(payload.email || ''))
      .replace(/{{phone}}/g, this.escape(payload.phone || ''))
      .replace(/{{summary}}/g, this.escape(payload.summary || ''))
      .replace(/{{skills}}/g, this.escape(payload.skills || ''))
      .replace(
        /<div[^>]*data-field="experienceHtml"[^>]*>.*?<\/div>/s,
        `<div data-field="experienceHtml">${safeExperience}</div>`,
      );
  }

  private buildContext(payload: any) {
    const sanitizePrimitive = (v: any) =>
      sanitizeHtml(String(v || ''), { allowedTags: [], allowedAttributes: {} });

    const sanitizeLimitedHtml = (v: any) =>
      sanitizeHtml(String(v || ''), {
        allowedTags: ['p', 'b', 'i', 'strong', 'em', 'ul', 'ol', 'li'],
        allowedAttributes: { a: ['href', 'target'] },
      });

    const ctx: any = {};
    ctx.fullName = sanitizePrimitive(payload.fullName || '');
    ctx.jobTitle = sanitizePrimitive(payload.jobTitle || '');
    ctx.email = sanitizePrimitive(payload.email || '');
    ctx.phone = sanitizePrimitive(payload.phone || '');
    ctx.website = sanitizePrimitive(payload.website || '');
    ctx.linkedin = sanitizePrimitive(payload.linkedin || '');
    ctx.summary = sanitizeLimitedHtml(payload.summary || '');
    ctx.skills = sanitizePrimitive(payload.skills || '');
    ctx.experience = Array.isArray(payload.experience)
      ? payload.experience.map((it) => ({
          role: sanitizePrimitive(it.role),
          company: sanitizePrimitive(it.company),
          period: sanitizePrimitive(it.period),
          bullets: Array.isArray(it.bullets)
            ? it.bullets.map((b: any) => sanitizePrimitive(b))
            : [],
        }))
      : [];
    ctx.education = Array.isArray(payload.education)
      ? payload.education.map((it) => ({
          degree: sanitizePrimitive(it.degree),
          institution: sanitizePrimitive(it.institution),
          year: sanitizePrimitive(it.year),
        }))
      : [];
    ctx.projects = Array.isArray(payload.projects)
      ? payload.projects.map((it) => ({
          title: sanitizePrimitive(it.title),
          role: sanitizePrimitive(it.role),
          description: sanitizeLimitedHtml(it.description || ''),
        }))
      : [];

    ctx.templateCssPath = 'template.css';

    return ctx;
  }

  private escape(s: string) {
    return (s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  private stripTags(html: string) {
    return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} });
  }
}