interface Tag {
  id: string;
  name: string;
}

interface Props {
  tags: Tag[];
  selectedTags: string[];
  onTagSelect: (tagName: string) => void;
}

export function TagFilter({ tags, selectedTags, onTagSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map(tag => (
        <button
          key={tag.id}
          onClick={() => onTagSelect(tag.name)}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            selectedTags.includes(tag.name)
              ? 'bg-blue-500 text-white'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800'
          }`}
        >
          {tag.name}
          <span className="ml-1 opacity-75">
            {selectedTags.includes(tag.name) ? '×' : '+'}
          </span>
        </button>
      ))}
    </div>
  );
}