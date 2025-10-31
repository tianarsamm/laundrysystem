"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient"; 

export default function LaundryExpertSystem() {
  const [formData, setFormData] = useState({
    fabricType: "",
    color: "",
    dirtLevel: "",
    hasOilStain: "",
    hasInkStain: "",
    clothesCount: "",
    clothingType: "",
    sensitiveMaterial: "",
    needIron: "",
    needExpress: "",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      fabricType,
      color,
      dirtLevel,
      hasOilStain,
      hasInkStain,
      clothesCount,
      clothingType,
      sensitiveMaterial,
      needIron,
      needExpress,
    } = formData;

    let recommendation = "Cuci Setrika Reguler";

    if (sensitiveMaterial === "ya" || fabricType === "sutra" || fabricType === "wol") {
      recommendation = "Dry Clean Premium";
    } else if (dirtLevel === "sangat kotor" && (hasOilStain === "ya" || hasInkStain === "ya")) {
      recommendation = "Cuci Kering";
    } else if (needExpress === "ya") {
      recommendation = "Cuci Setrika Express";
    } else if (needIron === "tidak") {
      recommendation = "Cuci Lipat Saja";
    } else if (color === "putih" && dirtLevel !== "ringan") {
      recommendation = "Cuci Setrika Premium (Pemutih Aman)";
    } else if (clothesCount === "banyak" && dirtLevel === "ringan") {
      recommendation = "Cuci Reguler (Kiloan)";
    }

    setResult(recommendation);

    // ✅ Simpan hasil konsultasi ke Supabase
    const { error } = await supabase.from("consultations").insert([
      {
        fabric_type: fabricType,
        color,
        dirt_level: dirtLevel,
        has_oil_stain: hasOilStain,
        has_ink_stain: hasInkStain,
        clothes_count: clothesCount,
        clothing_type: clothingType,
        sensitive_material: sensitiveMaterial,
        need_iron: needIron,
        need_express: needExpress,
        recommendation,
      },
    ]);

    if (error) {
      console.error("❌ Gagal menyimpan data:", error.message);
      alert("Gagal menyimpan data ke Supabase!");
    } else {
      console.log("✅ Data berhasil disimpan ke Supabase");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-500 flex items-center justify-center p-6 text-black">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          Konsultasi Pakaian Anda
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 shadow-2xl p-6 rounded-2xl bg-gradient-to-br from-white to-gray-100">
          {/* === Kondisi Form === */}
          {[
            { label: "Jenis Kain", name: "fabricType", options: ["katun", "sutra", "wol", "denim", "lainnya"] },
            { label: "Warna Pakaian", name: "color", options: ["putih", "warna", "gelap"] },
            { label: "Tingkat Kotor", name: "dirtLevel", options: ["ringan", "sedang", "sangat kotor"] },
            { label: "Ada Noda Minyak?", name: "hasOilStain", options: ["ya", "tidak"] },
            { label: "Ada Noda Tinta?", name: "hasInkStain", options: ["ya", "tidak"] },
            { label: "Jumlah Pakaian", name: "clothesCount", options: ["sedikit", "banyak"] },
            { label: "Jenis Pakaian", name: "clothingType", options: ["baju", "celana", "jas", "sprei", "lainnya"] },
            { label: "Ada Bahan Sensitif?", name: "sensitiveMaterial", options: ["ya", "tidak"] },
            { label: "Butuh Disetrika?", name: "needIron", options: ["ya", "tidak"] },
            { label: "Butuh Cepat Selesai?", name: "needExpress", options: ["ya", "tidak"] },
          ].map((field) => (
            <div key={field.name}>
              <label className="block font-medium mb-1">{field.label}</label>
              <select
                name={field.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Pilih</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div className="md:col-span-2 text-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading ? "bg-gray-500" : "bg-black hover:bg-gray-800"
              } text-white font-semibold px-6 py-2 rounded-lg transition-all`}
            >
              {loading ? "Menyimpan..." : "Dapatkan Rekomendasi"}
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-6 p-4 text-center bg-gray-100 border border-gray-300 rounded-xl">
            <h2 className="text-lg font-semibold text-black">Rekomendasi:</h2>
            <p className="text-xl font-bold text-black mt-1">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
