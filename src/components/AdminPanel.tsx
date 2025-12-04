import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

export function AdminPanel() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [overrideEmission, setOverrideEmission] = useState<string>("");

  const categories = useQuery(api.products.getCategories) || [];
  const productsResult = useQuery(api.products.listProducts, {
    paginationOpts: { numItems: 100, cursor: null },
    category: selectedCategory || undefined,
  });
  const allProducts = useQuery(api.products.getAllProductsForExport) || [];
  const updateProductEmission = useMutation(api.products.updateProductEmission);

  const products = productsResult?.page || [];

  const handleUpdateEmission = async (productId: string) => {
    const emission = overrideEmission ? parseFloat(overrideEmission) : undefined;
    await updateProductEmission({
      productId: productId as Id<"products">,
      override_emission: emission,
    });
    setEditingProduct(null);
    setOverrideEmission("");
  };

  const exportToCSV = () => {
    const headers = [
      "İsim",
      "Kategori", 
      "Fiyat",
      "Ağırlık (kg)",
      "Menşei Ülke",
      "Ambalaj Türü",
      "Temel Üretim Emisyonu",
      "Ayak İzi Puanı",
      "Tahmini kgCO2e",
      "Ayak İzi Etiketi",
      "Stokta"
    ];

    const csvContent = [
      headers.join(","),
      ...allProducts.map(product => [
        `"${product.name}"`,
        product.category,
        product.price,
        product.weight_kg,
        product.origin_country,
        product.packaging_type,
        product.base_production_emission,
        product.footprint_score,
        product.estimated_kgCO2e.toFixed(2),
        product.footprint_label,
        product.in_stock
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products_carbon_footprint.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(allProducts, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products_carbon_footprint.json";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Yönetim Paneli</h1>
        
        {/* Export Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Veri Dışa Aktar</h2>
          <div className="flex gap-4">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              CSV Olarak Dışa Aktar
            </button>
            <button
              onClick={exportToJSON}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              JSON Olarak Dışa Aktar
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategoriye Göre Filtrele
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürün
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fiyat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Karbon Puanı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tahmini kgCO₂e
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Emisyon Geçersiz Kılma
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-lg object-cover"
                        src={product.image_url}
                        alt={product.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.weight_kg} kg • {product.origin_country}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {product.category.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₺{product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.footprint.score <= 3 
                        ? 'bg-green-100 text-green-800'
                        : product.footprint.score <= 7
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.footprint.score}/10 • {product.footprint.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.footprint.estimated_kgCO2e.toFixed(2)}
                    {product.override_emission && (
                      <span className="ml-2 text-xs text-blue-600">(Geçersiz Kılındı)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingProduct === product._id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.01"
                          value={overrideEmission}
                          onChange={(e) => setOverrideEmission(e.target.value)}
                          placeholder="kgCO₂e"
                          className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <button
                          onClick={() => handleUpdateEmission(product._id)}
                          className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Kaydet
                        </button>
                        <button
                          onClick={() => {
                            setEditingProduct(null);
                            setOverrideEmission("");
                          }}
                          className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          İptal
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm">
                        {product.override_emission?.toFixed(2) || "—"}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingProduct !== product._id && (
                      <button
                        onClick={() => {
                          setEditingProduct(product._id);
                          setOverrideEmission(product.override_emission?.toString() || "");
                        }}
                        className="text-primary hover:text-primary-hover"
                      >
                        Düzenle
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Ürün bulunamadı.</p>
        </div>
      )}
    </div>
  );
}
