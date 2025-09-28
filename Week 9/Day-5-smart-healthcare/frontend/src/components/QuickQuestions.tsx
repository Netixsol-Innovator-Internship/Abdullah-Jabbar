import React from "react";

// Component for the User's suggested quick question bubbles
const UserQuickQuestion: React.FC<{
  question: string;
  onClick: () => void;
}> = ({ question, onClick }) => (
  <button
    onClick={onClick}
    className="text-xs sm:text-sm bg-white text-gray-700 py-1.5 px-3 rounded-full border border-gray-300 hover:bg-gray-50 transition duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mr-2 mb-2 max-w-[220px] sm:max-w-[280px] break-words whitespace-normal text-left"
  >
    {question}
  </button>
);

interface QuickQuestionsProps {
  onQuestionClick: (question: string) => void;
}

const QuickQuestions: React.FC<QuickQuestionsProps> = ({ onQuestionClick }) => (
  <div className="mt-6 flex flex-wrap justify-end">
    {/* Health concern based questions that align with your database */}
    <UserQuickQuestion
      question="I have trouble sleeping at night"
      onClick={() => onQuestionClick("I have trouble sleeping at night")}
    />
    <UserQuickQuestion
      question="I feel tired and low on energy"
      onClick={() => onQuestionClick("I feel tired and low on energy")}
    />
    <UserQuickQuestion
      question="I have joint pain and stiffness"
      onClick={() => onQuestionClick("I have joint pain and stiffness")}
    />
    <UserQuickQuestion
      question="I want to boost my immune system"
      onClick={() => onQuestionClick("I want to boost my immune system")}
    />
    <UserQuickQuestion
      question="I have digestive issues and gut problems"
      onClick={() =>
        onQuestionClick("I have digestive issues and gut problems")
      }
    />
    <UserQuickQuestion
      question="I want supplements for heart health"
      onClick={() => onQuestionClick("I want supplements for heart health")}
    />
    <UserQuickQuestion
      question="I need help with stress and anxiety"
      onClick={() => onQuestionClick("I need help with stress and anxiety")}
    />
    <UserQuickQuestion
      question="I want to improve my bone health"
      onClick={() => onQuestionClick("I want to improve my bone health")}
    />
  </div>
);

export default QuickQuestions;
