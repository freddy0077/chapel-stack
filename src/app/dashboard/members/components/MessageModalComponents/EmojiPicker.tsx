"use client";

import React from 'react';

// Simple emoji picker with common emojis
const commonEmojis = [
  ['😊', '👍', '❤️', '🙏', '✅'],
  ['🎉', '👋', '😀', '🙂', '😇'],
  ['🤔', '👏', '🌟', '✨', '💯'],
  ['🔥', '⭐', '🌈', '☀️', '🌺']
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  return (
    <div className="bg-white border rounded-md shadow-lg p-2 absolute z-10">
      <div className="flex flex-col gap-1">
        {commonEmojis.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.map((emoji, index) => (
              <button
                key={`${rowIndex}-${index}`}
                type="button"
                onClick={() => onEmojiSelect(emoji)}
                className="text-2xl p-2 hover:bg-gray-100 rounded w-10 h-10 flex items-center justify-center"
              >
                {emoji}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
