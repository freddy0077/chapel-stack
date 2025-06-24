"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Song } from '../SongLibrary';

// Define key signatures for transposition
const KEYS = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];

// Nashville Number System uses scale degrees 1-7
// This mapping is built into the chordToNashville function

// Chord diagrams for common chords
const CHORD_DIAGRAMS: Record<string, string[]> = {
  // Major chords
  'C': ['x32010', 'C'],
  'D': ['xx0232', 'D'],
  'E': ['022100', 'E'],
  'F': ['133211', 'F'],
  'G': ['320003', 'G'],
  'A': ['x02220', 'A'],
  'B': ['x24442', 'B'],
  
  // Minor chords
  'Cm': ['x35543', 'Cm'],
  'Dm': ['xx0231', 'Dm'],
  'Em': ['022000', 'Em'],
  'Fm': ['133111', 'Fm'],
  'Gm': ['355333', 'Gm'],
  'Am': ['x02210', 'Am'],
  'Bm': ['x24432', 'Bm'],
  
  // 7th chords
  'C7': ['x32310', 'C7'],
  'D7': ['xx0212', 'D7'],
  'E7': ['020100', 'E7'],
  'F7': ['131211', 'F7'],
  'G7': ['320001', 'G7'],
  'A7': ['x02020', 'A7'],
  'B7': ['x21202', 'B7']
};

// Function to generate chord diagram SVG
function generateChordDiagram(chord: string): string {
  const defaultDiagram = ['x00000', chord]; // Default if chord not found
  const [positions, chordName] = CHORD_DIAGRAMS[chord] || defaultDiagram;
  
  const width = 80;
  const height = 100;
  const numStrings = 6;
  const numFrets = 5;
  const stringSpacing = width / (numStrings - 1);
  const fretSpacing = (height - 20) / numFrets;
  
  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
`;
  
  // Add chord name
  svg += `<text x="${width/2}" y="15" text-anchor="middle" font-family="Arial" font-size="14">${chordName}</text>\n`;
  
  // Draw strings
  for (let i = 0; i < numStrings; i++) {
    svg += `<line x1="${i * stringSpacing}" y1="20" x2="${i * stringSpacing}" y2="${height}" stroke="black" stroke-width="1" />\n`;
  }
  
  // Draw frets
  for (let i = 0; i <= numFrets; i++) {
    svg += `<line x1="0" y1="${20 + i * fretSpacing}" x2="${width}" y2="${20 + i * fretSpacing}" stroke="black" stroke-width="${i === 0 ? 2 : 1}" />\n`;
  }
  
  // Add finger positions
  for (let i = 0; i < numStrings; i++) {
    const pos = positions[i];
    if (pos === 'x') {
      // X at top for muted string
      svg += `<text x="${i * stringSpacing}" y="18" text-anchor="middle" font-family="Arial" font-size="12">X</text>\n`;
    } else if (pos === '0') {
      // O at top for open string
      svg += `<circle cx="${i * stringSpacing}" cy="10" r="5" stroke="black" stroke-width="1" fill="none" />\n`;
    } else {
      // Finger position on fret
      const fretNum = parseInt(pos);
      svg += `<circle cx="${i * stringSpacing}" cy="${20 + (fretNum - 0.5) * fretSpacing}" r="6" fill="black" />\n`;
    }
  }
  
  svg += '</svg>';
  return svg;
}

interface ChordChartGeneratorProps {
  song: Song;
}

type ChartFormat = 'standard' | 'nashville';
type ChartSection = {
  type: 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro';
  number?: number;
  content: string;
};

export default function ChordChartGenerator({ song }: ChordChartGeneratorProps) {
  const [selectedKey, setSelectedKey] = useState(song.defaultKey || 'C');
  const [transposedChart, setTransposedChart] = useState(song.chordChart || '');
  const [showPrintView, setShowPrintView] = useState(false);
  const [chartFormat, setChartFormat] = useState<ChartFormat>('standard');
  const [showChordDiagrams, setShowChordDiagrams] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [parsedSections, setParsedSections] = useState<ChartSection[]>([]);
  const [uniqueChords, setUniqueChords] = useState<string[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Parse chord chart into sections
  const parseChordChartSections = useCallback((chordChart: string): ChartSection[] => {
    const lines = chordChart.split('\n');
    const sections: ChartSection[] = [];
    
    let currentSection: ChartSection | null = null;
    
    lines.forEach(line => {
      // Check if line indicates a new section
      const sectionMatch = line.match(/^(verse|chorus|bridge|intro|outro)\s*(?:(\d+))?:?\s*$/i);
      
      if (sectionMatch) {
        // Save previous section if exists
        if (currentSection) {
          sections.push(currentSection);
        }
        
        // Start new section
        currentSection = {
          type: sectionMatch[1].toLowerCase() as ChartSection['type'],
          number: sectionMatch[2] ? parseInt(sectionMatch[2]) : undefined,
          content: ''
        };
      } else if (currentSection) {
        // Add line to current section
        currentSection.content += (currentSection.content ? '\n' : '') + line;
      } else {
        // If no section has been defined yet, create a default one
        currentSection = {
          type: 'verse',
          content: line
        };
      }
    });
    
    // Add the last section
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections;
  }, []);

  // Extract unique chords from chart
  const extractUniqueChords = useCallback((chordChart: string): string[] => {
    const chordRegex = /\b[A-G][#b]?(?:m|maj|min|aug|dim|sus[24]?|[2-9]|7|13)?\b/g;
    const matches = chordChart.match(chordRegex) || [];
    
    // Get unique chords
    return Array.from(new Set(matches));
  }, []);

  // Define a memoized transpose chord chart function
  const transposeChordChart = useCallback((chordChart: string, fromKey: string, toKey: string): string => {
    if (fromKey === toKey && chartFormat === 'standard') return chordChart;

    // For Nashville Number System, convert to numbers based on the original key
    if (chartFormat === 'nashville') {
      return chordChart.replace(/\b[A-G][#b]?(?:m|maj|min|aug|dim|sus[24]?|[2-9]|7|13)?\b/g, (chord) => {
        return chordToNashville(chord, fromKey);
      });
    }

    // Standard transposition
    const fromIndex = KEYS.findIndex(k => k.includes(fromKey.replace('m', '')));
    const toIndex = KEYS.findIndex(k => k.includes(toKey.replace('m', '')));
    
    if (fromIndex === -1 || toIndex === -1) return chordChart;
    
    const semitones = (toIndex - fromIndex + 12) % 12;
    
    // Replace all chords in the chart - handling more complex chord types
    return chordChart.replace(/\b[A-G][#b]?(?:m|maj|min|aug|dim|sus[24]?|[2-9]|7|13)?\b/g, (chord) => {
      // Extract root note and suffix
      const rootNote = chord.match(/^[A-G][#b]?/)?.[0] || '';
      const suffix = chord.replace(rootNote, '');
      
      // Get the index of the root note
      const rootIndex = KEYS.findIndex(k => k.includes(rootNote));
      if (rootIndex === -1) return chord;
      
      // Calculate the new note index
      const newNoteIndex = (rootIndex + semitones) % 12;
      
      // Get the new key name (using the first format if there are multiple like C#/Db)
      const newKey = KEYS[newNoteIndex].split('/')[0];
      
      // Return the new chord
      return newKey + suffix;
    });
  }, [chartFormat]);

  // Handle key change - memoized to prevent dependency cycles
  const handleKeyChange = useCallback((newKey: string) => {
    setSelectedKey(newKey);
    if (song.chordChart && song.defaultKey) {
      const transposed = transposeChordChart(song.chordChart, song.defaultKey, newKey);
      setTransposedChart(transposed);
      
      // Update parsed sections and unique chords with the transposed content
      setParsedSections(parseChordChartSections(transposed));
      setUniqueChords(extractUniqueChords(transposed));
    }
  }, [song.chordChart, song.defaultKey, transposeChordChart, parseChordChartSections, extractUniqueChords]);
  
  // Parse chord chart into sections on component mount
  useEffect(() => {
    if (song.chordChart) {
      const sections = parseChordChartSections(song.chordChart);
      setParsedSections(sections);
      setUniqueChords(extractUniqueChords(song.chordChart));
      
      // Set initial transposed chart
      if (song.defaultKey && song.defaultKey !== selectedKey) {
        handleKeyChange(selectedKey);
      }
    }
  }, [song.chordChart, song.defaultKey, selectedKey, handleKeyChange, parseChordChartSections, extractUniqueChords]);

  // Convert chord to Nashville Number notation
  const chordToNashville = (chord: string, fromKey: string): string => {
    // Extract root note and suffix
    const rootNote = chord.match(/^[A-G][#b]?/)?.[0] || '';
    const suffix = chord.replace(rootNote, '');
    
    // Get the number for this chord in the key
    const rootIndex = KEYS.findIndex(k => k.includes(rootNote));
    const keyIndex = KEYS.findIndex(k => k.includes(fromKey.replace('m', '')));
    
    if (rootIndex === -1 || keyIndex === -1) return chord;
    
    // Calculate the scale degree
    const degreeIndex = (rootIndex - keyIndex + 12) % 12;
    
    // Convert to Nashville number
    const nashvilleMap = [1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 6, 7];
    const nashvilleNumber = nashvilleMap[degreeIndex];
    
    // Check if it's a flat or sharp degree
    let accidental = '';
    if ([1, 2, 4, 5, 6].includes(nashvilleNumber)) {
      if ([1, 3, 6, 8, 10].includes(degreeIndex)) {
        accidental = '♯';
      } else if ([2, 4, 7, 9, 11].includes(degreeIndex)) {
        accidental = '♭';
      }
    }
    
    // Format the number with the suffix
    return `${nashvilleNumber}${accidental}${suffix}`;
  };




  const togglePrintView = () => {
    setShowPrintView(!showPrintView);
  };

  // Export chart as PDF
  const exportAsPDF = () => {
    // In a real implementation, you would use a library like jsPDF to create a PDF
    alert('PDF export functionality would be implemented with a library like jsPDF');
  };

  // Format chart section for display
  const formatSection = (section: ChartSection, index: number) => {
    const sectionTitle = `${section.type.charAt(0).toUpperCase()}${section.type.slice(1)}${section.number ? ' ' + section.number : ''}`;
    
    return (
      <div key={index} className="mb-6">
        <div className="font-bold text-gray-700 mb-2">{sectionTitle}</div>
        <pre className="whitespace-pre-wrap">{section.content}</pre>
      </div>
    );
  };

  // Render chord diagrams
  const renderChordDiagrams = () => {
    if (!showChordDiagrams || uniqueChords.length === 0) return null;
    
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h4 className="font-semibold text-gray-700 mb-3">Chord Diagrams</h4>
        <div className="flex flex-wrap gap-4">
          {uniqueChords.map((chord, index) => (
            <div key={index} className="inline-block" dangerouslySetInnerHTML={{ __html: generateChordDiagram(chord) }} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Chord Chart Generator</h3>
      
      {!song.chordChart ? (
        <div className="text-gray-500 italic">No chord chart available for this song.</div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Key selection */}
            <div className="flex items-center space-x-2">
              <label htmlFor="key-select" className="text-sm font-medium text-gray-700">
                Key:
              </label>
              <select
                id="key-select"
                value={selectedKey}
                onChange={(e) => handleKeyChange(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {KEYS.map((key) => (
                  <option key={key} value={key.split('/')[0]}>
                    {key}
                  </option>
                ))}
              </select>
            </div>

            {/* Format selection */}
            <div className="flex items-center space-x-2">
              <label htmlFor="format-select" className="text-sm font-medium text-gray-700">
                Format:
              </label>
              <select
                id="format-select"
                value={chartFormat}
                onChange={(e) => setChartFormat(e.target.value as ChartFormat)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="standard">Standard</option>
                <option value="nashville">Nashville Numbers</option>
              </select>
            </div>

            {/* Font size */}
            <div className="flex items-center space-x-2">
              <label htmlFor="font-size" className="text-sm font-medium text-gray-700">
                Size:
              </label>
              <input
                id="font-size"
                type="range"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-24"
              />
            </div>

            {/* Chord diagrams toggle */}
            <div className="flex items-center space-x-2">
              <label htmlFor="show-diagrams" className="text-sm font-medium text-gray-700">
                Show Chord Diagrams:
              </label>
              <input
                id="show-diagrams"
                type="checkbox"
                checked={showChordDiagrams}
                onChange={() => setShowChordDiagrams(!showChordDiagrams)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              type="button"
              onClick={togglePrintView}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {showPrintView ? 'Edit View' : 'Print View'}
            </button>
            
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Print
            </button>
            
            <button
              type="button"
              onClick={() => {
                // Create a blob with the chord chart
                const blob = new Blob([transposedChart], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                
                // Create a temporary link and trigger download
                const a = document.createElement('a');
                a.href = url;
                a.download = `${song.title} - Chord Chart (${selectedKey}).txt`;
                a.click();
                
                // Clean up
                URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Download TXT
            </button>
            
            <button
              type="button"
              onClick={exportAsPDF}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Export PDF
            </button>
          </div>
          
          {/* Chart content */}
          <div 
            ref={chartRef}
            className={`mt-4 ${showPrintView ? 'font-mono p-8 border' : 'font-mono bg-gray-50 p-4 rounded-md'}`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {parsedSections.length > 0 ? (
              <div>
                {/* Song header */}
                <div className="mb-6 text-center">
                  <h2 className="text-xl font-bold">{song.title}</h2>
                  <p className="text-gray-600">{song.author} | Key: {selectedKey}</p>
                </div>
                
                {/* Formatted sections */}
                {parsedSections.map((section, index) => formatSection(section, index))}
              </div>
            ) : (
              <pre className="whitespace-pre-wrap">{transposedChart}</pre>
            )}
          </div>
          
          {/* Chord diagrams */}
          {renderChordDiagrams()}
        </>
      )}
    </div>
  );
}
