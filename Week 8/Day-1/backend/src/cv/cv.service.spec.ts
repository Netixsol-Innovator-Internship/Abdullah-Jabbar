// cv.service.spec.ts
import { CvService } from './cv.service';
import { join } from 'path';
import { writeFileSync, readFileSync, mkdirSync } from 'fs';

describe('CvService', () => {
  it('renders template with sanitized fields', () => {
    const svc = new CvService();
    // create a tiny template in a temp dir
    svc.templateDir = join(__dirname, '..', '..', 'templates');
    const tplPath = join(svc.templateDir, 'template.html');
    const original = readFileSync(tplPath, 'utf8');
    const payload = {
      fullName: 'Alice <script>alert(1)</script>',
      jobTitle: 'Engineer',
      summary: '<p>Good</p><script>evil()</script>',
    };
    const out = svc.renderHtml(payload);
    expect(out).toContain('Alice');
    expect(out).not.toContain('<script>');
    expect(out).toContain('<p>Good</p>');
    // should include escaped jobTitle
    expect(out).toContain('Engineer');
  });
});
