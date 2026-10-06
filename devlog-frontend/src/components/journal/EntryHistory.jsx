import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EntryHistory = () => {
  const [entries, setEntries] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    project: '',
    tag: '',
    language: '',
    dateFrom: '',
    dateTo: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Mock data for demonstration
  const mockEntries = [
    {
      id: 1,
      date: '2026-09-30',
      projectName: 'DevLog',
      language: 'Java',
      timeSpentMin: 90,
      mood: 'FOCUSED',
      sections: [
        { type: 'TASK', content: 'Set up DevLog project structure' },
        { type: 'INPUT', content: 'Requirements for developer journal app' },
        { type: 'OUTPUT', content: 'Basic Spring Boot and React structure' },
        { type: 'WHAT_I_LEARNED', content: 'How to configure GitHub OAuth with Spring Security' }
      ],
      tags: [{ name: 'java' }, { name: 'setup' }, { name: 'spring-boot' }]
    },
    {
      id: 2,
      date: '2026-09-29',
      projectName: 'java-practice',
      language: 'Java',
      timeSpentMin: 60,
      mood: 'PRODUCTIVE',
      sections: [
        { type: 'TASK', content: 'Practice Java Streams API' },
        { type: 'INPUT', content: 'List of student objects' },
        { type: 'OUTPUT', content: 'Filtered and mapped student data' },
        { type: 'SAMPLE', content: 'students.stream().filter(s -> s.getGrade() > 80).map(Student::getName).toList()' },
        { type: 'WHAT_I_LEARNED', content: 'Streams provide functional-style operations on collections' }
      ],
      tags: [{ name: 'java' }, { name: 'streams' }, { name: 'practice' }]
    }
  ];

  useEffect(() => {
    setLoading(true);
    fetch('/api/entries')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(res.statusText))))
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setEntries(
          list.map((e) => ({
            id: e.id,
            date: e.date,
            projectName: e.projectName,
            language: e.language,
            timeSpentMin: e.timeSpentMin,
            mood: e.mood,
            sections: [
              { type: 'TASK', content: e.task || '' },
              { type: 'INPUT', content: e.input || '' },
              { type: 'OUTPUT', content: e.output || '' },
              { type: 'SAMPLE', content: e.sample || '' },
              { type: 'WHAT_I_LEARNED', content: e.whatILearned || '' },
            ].filter((s) => s.content),
            tags: (e.tags || []).map((name) => ({ name })),
          }))
        );
        setLoading(false);
      })
      .catch(() => {
        setEntries(mockEntries);
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      project: '',
      tag: '',
      language: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch =
      !filters.search ||
      entry.projectName.toLowerCase().includes(filters.search.toLowerCase()) ||
      entry.sections.some(section =>
        section.content.toLowerCase().includes(filters.search.toLowerCase())
      );

    const matchesProject = !filters.project || entry.projectName === filters.project;
    const matchesLanguage = !filters.language || entry.language === filters.language;

    const matchesTags = !filters.tag ||
      entry.tags.some(tag => tag.name === filters.tag);

    const matchesDateFrom = !filters.dateFrom ||
      entry.date >= filters.dateFrom;

    const matchesDateTo = !filters.dateTo ||
      entry.date <= filters.dateTo;

    return matchesSearch && matchesProject && matchesLanguage && matchesTags && matchesDateFrom && matchesDateTo;
  });

  const handleViewEntry = (id) => {
    navigate(`/journal/history/${id}`);
  };

  const handleEditEntry = (id) => {
    navigate(`/journal/history/${id}/edit`);
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await fetch(`/api/entries/${id}`, { method: 'DELETE' });
      } catch {
        // backend may be down; still remove locally
      }
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">Entry History</h1>
        <button
          onClick={handleResetFilters}
          className="text-text-secondary hover:text-text-primary"
        >
          Reset Filters
        </button>
      </div>

      <div className="bg-bg-secondary/50 rounded-lg p-4 border border-border">
        <h2 className="text-lg font-semibold text-text-primary mb-3">Filters</h2>
        <form className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-journal"
                placeholder="Search in entries..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Project</label>
              <input
                type="text"
                name="project"
                value={filters.project}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-journal"
                placeholder="Filter by project..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <select
                name="language"
                value={filters.language}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-journal"
              >
                <option value="">All Languages</option>
                <option value="Java">Java</option>
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Python">Python</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tag</label>
              <input
                type="text"
                name="tag"
                value={filters.tag}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-journal"
                placeholder="Filter by tag..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date From</label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-journal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date To</label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-journal"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleFilterChange}
              className="bg-journal hover:bg-journal/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full border-4 border-b-journal h-12 w-12 mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading entries...</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-text-primary">
              Entries ({filteredEntries.length})
            </h2>
            <button
              onClick={() => navigate('/journal/add')}
              className="bg-journal hover:bg-journal/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              New Entry
            </button>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-text-secondary">No entries found matching your filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map(entry => (
                <div
                  key={entry.id}
                  className="bg-bg-secondary/50 rounded-lg p-4 border border-border hover:bg-bg-secondary/70 transition-colors cursor-pointer"
                  onClick={() => handleViewEntry(entry.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-primary">
                        {entry.projectName || 'General Work'}
                      </h3>
                      <p className="text-text-secondary text-sm">
                        {new Date(entry.date).toLocaleDateString()} •
                        {entry.timeSpentMin} min •
                        {entry.language || 'N/A'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <span className="text-xs bg-journal/20 text-journal px-2 py-0.5 rounded">
                        {entry.mood}
                      </span>
                      {entry.tags.map(tag => (
                        <span
                          key={tag.name}
                          className="text-xs bg-insights/20 text-insights px-2 py-0.5 rounded"
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3">
                    <h4 className="font-medium text-text-primary mb-1">What I worked on</h4>
                    <p className="text-text-secondary line-clamp-2">
                      {entry.sections.find(s => s.type === 'TASK')?.content || 'No task description'}
                    </p>
                  </div>

                  {entry.sections.find(s => s.type === 'SAMPLE') && (
                    <div className="mt-3">
                      <h4 className="font-medium text-text-primary mb-1">Sample</h4>
                      <pre className="bg-bg-secondary p-3 rounded text-text-secondary text-xs overflow-auto">
                        {entry.sections.find(s => s.type === 'SAMPLE')?.content}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-6">
        <button
          onClick={() => navigate('/journal/add')}
          className="w-full bg-journal hover:bg-journal/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Add New Entry
        </button>
      </div>
    </div>
  );
};

export default EntryHistory;