import { useState } from "react";
import { Search, Edit2, Trash2, Plus, FileText } from "lucide-react";
import { NEWS_DATA } from "../../pages/News"; 

export default function Articles() {
  const [articles, setArticles] = useState(NEWS_DATA);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter articles based on search
  const filtered = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete handler
  const handleDelete = (id) => {
    if (window.confirm("Delete this article?")) {
      setArticles(articles.filter((a) => a.id !== id));
    }
  };

  // Edit handler (placeholder)
  const handleEdit = (id) => {
    // navigate to edit page or open modal
    alert(`Edit article ${id}`);
  };

  // Add new article (placeholder)
  const handleAdd = () => {
    // navigate to create page or open modal
    alert("Create new article");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Articles</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage blog posts and thought leadership ({articles.length} total)
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} /> New Article
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-yellow-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((article) => (
                <tr key={article.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-white font-medium flex items-center gap-2">
                    <FileText size={14} className="text-gray-500" /> {article.title}
                  </td>
                  <td className="px-6 py-4 text-gray-300">{article.category}</td>
                  <td className="px-6 py-4 text-gray-400">{article.date}</td>
                  <td className="px-6 py-4 text-gray-300">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        article.featured
                          ? "bg-yellow-900/50 text-yellow-400"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {article.featured ? "Featured" : "Standard"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => handleEdit(article.id)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No articles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}