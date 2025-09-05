"use client";

import { useState } from "react";
import { Song } from "../SongLibrary";

interface LyricsProjectionProps {
  song: Song;
}

export default function LyricsProjection({ song }: LyricsProjectionProps) {
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState("36");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [showPreviewMode, setShowPreviewMode] = useState(false);

  // Split lyrics into slides (by empty lines)
  const slides = song.lyrics
    ? song.lyrics.split("\n\n").map((slide) => slide.trim())
    : [];

  // Current slide in preview mode
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // Generate a single slide for presentation
  const generateSlide = (slideText: string, index: number) => {
    return (
      <div
        key={index}
        className="flex items-center justify-center p-8 rounded-lg shadow-inner"
        style={{
          backgroundColor: backgroundColor,
          minHeight: "300px",
          width: "100%",
        }}
      >
        <p
          className="text-center whitespace-pre-line"
          style={{
            color: textColor,
            fontSize: `${fontSize}px`,
            fontFamily: fontFamily,
          }}
        >
          {slideText}
        </p>
      </div>
    );
  };

  // Generate presentation slides for export
  const exportToPresentation = () => {
    // In a real application, this would generate PowerPoint/ProPresenter/etc slides
    // For demonstration purposes, we'll just display an alert
    alert(
      "This would export to PowerPoint, ProPresenter, or another presentation software in a real application.",
    );

    // Download as HTML (for demo purposes)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${song.title} - Lyrics Presentation</title>
          <style>
            body { margin: 0; padding: 0; }
            .slide {
              background-color: ${backgroundColor};
              color: ${textColor};
              font-family: ${fontFamily};
              font-size: ${fontSize}px;
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              white-space: pre-line;
            }
            .slide-content {
              padding: 40px;
            }
          </style>
        </head>
        <body>
          ${slides
            .map(
              (slide, i) => `
            <div class="slide" id="slide-${i}">
              <div class="slide-content">${slide}</div>
            </div>
          `,
            )
            .join("")}
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${song.title} - Lyrics Presentation.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Lyrics Projection System</h3>

      {!song.lyrics ? (
        <div className="text-gray-500 italic">
          No lyrics available for this song.
        </div>
      ) : (
        <>
          {!showPreviewMode ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Appearance
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="background-color"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Background Color
                      </label>
                      <input
                        type="color"
                        id="background-color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="text-color"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Text Color
                      </label>
                      <input
                        type="color"
                        id="text-color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="font-size"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Font Size (px)
                      </label>
                      <input
                        type="number"
                        id="font-size"
                        min="12"
                        max="72"
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="font-family"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Font Family
                      </label>
                      <select
                        id="font-family"
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Tahoma">Tahoma</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </h4>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    {generateSlide(slides[0], 0)}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowPreviewMode(true)}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Enter Presentation Mode
                </button>

                <button
                  type="button"
                  onClick={exportToPresentation}
                  className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Export to Presentation
                </button>
              </div>
            </div>
          ) : (
            <div className="fixed inset-0 bg-black z-50 flex flex-col">
              <div className="flex-1 flex items-center justify-center">
                {generateSlide(slides[currentSlideIndex], currentSlideIndex)}
              </div>

              <div className="p-4 bg-gray-800 flex justify-between items-center">
                <div className="text-white">
                  Slide {currentSlideIndex + 1} of {slides.length}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={prevSlide}
                    disabled={currentSlideIndex === 0}
                    className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={nextSlide}
                    disabled={currentSlideIndex === slides.length - 1}
                    className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPreviewMode(false)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                  >
                    Exit Presentation
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
