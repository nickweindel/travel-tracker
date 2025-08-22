'use client';

import { useEffect, useState } from 'react';

interface Country {
  country_id: string;
  country_name: string;
  continent: string;
  visited: boolean;
}

interface CountriesTableProps {
  onCountriesChange?: (countries: Country[]) => void;
}

export default function CountriesTable({ onCountriesChange }: CountriesTableProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCheckboxChange = async (countryId: string, checked: boolean) => {
    try {
      const response = await fetch('/api/toggle-country-visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ countryId, visited: checked }),
      });

      if (!response.ok) {
        throw new Error('Failed to update visit status');
      }

      // Update local state
      const updatedCountries = countries.map(country =>
        country.country_id === countryId
          ? { ...country, visited: checked }
          : country
      );
      setCountries(updatedCountries);
      onCountriesChange?.(updatedCountries);
    } catch (err) {
      console.error('Error updating visit status:', err);
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/get-countries');
        console.log(response);
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data = await response.json();
        setCountries(data);
        onCountriesChange?.(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Table Section */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <tbody className="divide-y divide-gray-200">
              {countries.map((country) => (
                <tr key={country.country_id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900 w-4/5">
                    {country.country_name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 w-1/5 text-center">
                    <input
                      type="checkbox"
                      checked={country.visited}
                      onChange={(e) => handleCheckboxChange(country.country_id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}