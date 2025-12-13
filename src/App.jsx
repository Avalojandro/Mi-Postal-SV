import { useState } from "react";
import postalData from "./data.json";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCode, setCopiedCode] = useState("");

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  // Filter data based on search term
  const filterData = () => {
    if (!searchTerm) return postalData;

    const filtered = {};
    Object.keys(postalData).forEach((department) => {
      const departmentMatch = department
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const filteredDistricts = {};

      Object.keys(postalData[department]).forEach((district) => {
        const districtMatch = district
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const filteredMunicipalities = {};

        Object.keys(postalData[department][district]).forEach(
          (municipality) => {
            const municipalityMatch = municipality
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
            const codeMatch =
              postalData[department][district][municipality].includes(
                searchTerm
              );

            if (
              departmentMatch ||
              districtMatch ||
              municipalityMatch ||
              codeMatch
            ) {
              filteredMunicipalities[municipality] =
                postalData[department][district][municipality];
            }
          }
        );

        if (Object.keys(filteredMunicipalities).length > 0) {
          filteredDistricts[district] = filteredMunicipalities;
        }
      });

      if (Object.keys(filteredDistricts).length > 0) {
        filtered[department] = filteredDistricts;
      }
    });

    return filtered;
  };

  const filteredData = filterData();

  return (
    <div className="min-h-screen w-full background-pattern pb-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto pt-12 pb-8 flex flex-col items-center px-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="80px"
          viewBox="0 -960 960 960"
          width="80px"
          className="fill-blue-900 mb-4"
        >
          <path d="M480-480Zm0-40 320-200H160l320 200ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v280h-80v-200L480-440 160-640v400h360v80H160ZM715-42l-70-40 46-78h-91v-80h91l-46-78 70-40 45 78 45-78 70 40-46 78h91v80h-91l46 78-70 40-45-78-45 78Z" />
        </svg>
        <h1 className="text-blue-900 text-5xl font-bold text-center mb-6">
          Mi Postal SV
        </h1>
        <p className="text-gray-700 text-lg text-center mb-8">
          Códigos postales de El Salvador
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Buscar departamento, distrito, municipio o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 rounded-full border-2 border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-lg"
          />
        </div>
      </div>

      {/* Data Display */}
      <div className="max-w-6xl mx-auto px-4">
        {Object.keys(filteredData).length === 0 ? (
          <div className="text-center text-gray-600 text-xl mt-12">
            No se encontraron resultados
          </div>
        ) : (
          Object.keys(filteredData).map((department) => (
            <div key={department} className="mb-8">
              {/* Department Header */}
              <h2 className="text-3xl font-bold text-blue-900 mb-4 border-b-4 border-blue-800 pb-2">
                {department}
              </h2>

              {/* Districts */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(filteredData[department]).map((district) => (
                  <div
                    key={district}
                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border-2 border-blue-200 hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* District Name */}
                    <h3 className="text-xl font-semibold text-blue-800 mb-4 border-b border-blue-300 pb-2">
                      {district}
                    </h3>

                    {/* Municipalities */}
                    <div className="space-y-2">
                      {Object.keys(filteredData[department][district]).map(
                        (municipality) => {
                          const code =
                            filteredData[department][district][municipality];
                          return (
                            <div
                              key={municipality}
                              className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                            >
                              <span className="text-gray-700 font-medium">
                                {municipality}
                              </span>
                              <button
                                onClick={() => copyToClipboard(code)}
                                className="text-blue-900 font-bold bg-blue-100 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors cursor-pointer relative"
                                title="Copiar código"
                              >
                                {copiedCode === code ? "✓ Copiado" : code}
                              </button>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <footer className="text-center pt-8 mt-12 text-gray-600">
        <p>
          Proyecto realizado por{" "}
          <a
            href="https://github.com/Avalojandro"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-bold"
          >
            Avalojandro
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
