import { NextRequest, NextResponse } from "next/server";

type RestCountryV5 = {
  codes?: {
    alpha_2?: string;
    alpha_3?: string;
    ccn3?: string;
  };
};

type CountryResult = {
  cca2: string;
  cca3: string;
  ccn3: string;
};

async function fetchCountryByCode(
  code: string,
  apiKey: string,
): Promise<CountryResult | null> {
  const normalized = code.trim().toUpperCase();

  const path =
    normalized.length === 2
      ? `codes.alpha_2/${encodeURIComponent(normalized)}`
      : `codes.alpha_3/${encodeURIComponent(normalized)}`;

  const res = await fetch(
    `https://api.restcountries.com/countries/v5/${path}?response_fields=codes.alpha_2,codes.alpha_3,codes.ccn3`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      next: {
        revalidate: 86400,
      },
    },
  );

  if (!res.ok) {
    console.error(
      `REST Countries lookup failed for ${normalized}: ${res.status}`,
    );
    return null;
  }

  const json = await res.json();

  const country = json.data?.objects?.[0] as RestCountryV5 | undefined;

  if (!country?.codes) {
    return null;
  }

  return {
    cca2: country.codes.alpha_2 ?? "",
    cca3: country.codes.alpha_3 ?? "",
    ccn3: country.codes.ccn3 ?? "",
  };
}

export async function GET(request: NextRequest) {
  const codes = new URL(request.url).searchParams.get("codes");

  if (!codes) {
    return NextResponse.json(
      { error: "Missing codes parameter" },
      { status: 400 },
    );
  }

  const apiKey = process.env.REST_COUNTRIES_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "REST_COUNTRIES_API_KEY is not configured" },
      { status: 500 },
    );
  }

  try {
    const uniqueCodes = [
      ...new Set(
        codes
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      ),
    ];

    const countries = await Promise.all(
      uniqueCodes.map((code) => fetchCountryByCode(code, apiKey)),
    );

    return NextResponse.json(
      countries.filter(
        (country): country is CountryResult => country !== null,
      ),
    );
  } catch (error) {
    console.error("REST Countries proxy error:", error);

    return NextResponse.json(
      { error: "Failed to fetch country data" },
      { status: 500 },
    );
  }
}