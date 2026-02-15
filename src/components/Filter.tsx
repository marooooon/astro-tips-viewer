import { useState, useEffect, type ChangeEvent } from 'react';
import type { Post } from '../types/post';

interface FilterProps {
  posts: Post[];
}

export default function Filter({ posts }: FilterProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 全タグを抽出（重複なし）
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

  useEffect(() => {
    let filtered = posts;

    // 検索フィルター（title, description, bodyを対象）
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.description.toLowerCase().includes(term) ||
          post.body.toLowerCase().includes(term)
      );
    }

    // タグフィルター（OR条件）
    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) =>
        post.tags.some((tag) => selectedTags.includes(tag))
      );
    }

    // カスタムイベントを発火してフィルタ結果を通知
    const event = new CustomEvent('postsFiltered', { detail: filtered });
    window.dispatchEvent(event);
  }, [searchTerm, selectedTags, posts]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="filter-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="タイトル・説明・本文から検索..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <div className="tag-filter">
        <span className="filter-label">タグで絞り込み:</span>
        <div className="tag-buttons">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`tag-button ${selectedTags.includes(tag) ? 'active' : ''}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
