import React from "react";

const SearchHistory = ({ history, onSelectSearch, onClearHistory }) => {
  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="bg-black/30 backdrop-blur-lg p-6 rounded-lg border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">Search History</h3>
        <button
          onClick={onClearHistory}
          className="text-sm text-pink-500 hover:text-pink-400 transition-colors"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-3">
        {history.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-all duration-200 backdrop-blur-sm border border-white/5"
            onClick={() => onSelectSearch(item)}
          >
            <div>
              <p className="font-medium text-white">{item.query}</p>
              <p className="text-sm text-gray-400">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="text-sm text-gray-400">
              {item.filters.genres.length > 0 && (
                <span className="mr-3 bg-white/10 px-3 py-1 rounded-full">
                  {item.filters.genres.length} genres
                </span>
              )}
              {item.filters.year && (
                <span className="mr-3 bg-white/10 px-3 py-1 rounded-full">
                  Year: {item.filters.year}
                </span>
              )}
              {item.filters.language && (
                <span className="bg-white/10 px-3 py-1 rounded-full">
                  Lang: {item.filters.language}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
