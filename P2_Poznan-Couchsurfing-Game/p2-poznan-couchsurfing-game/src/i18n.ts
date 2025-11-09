// src/i18n.ts
// Minimalistyczny i18n bez bibliotek

// UWAGA NA ŚCIEŻKĘ: w obecnym repo en.json jest w katalogu głównym.
// Jeśli przeniesiesz go do /i18n/en.json, zmień import na "../i18n/en.json".
import en from "../i18n/en.json";

type Dict = Record<string, string>;
type Lang = string;

// Rejestr słowników językowych (EN zawsze jest bazą)
const dicts: Record<Lang, Dict> = {
    en: en as Dict,
};

/**
 * Zwraca przetłumaczony string.
 * 1) Próbuje lang
 * 2) Fallback do en
 * 3) Gdy dalej brak, oddaje key (łatwiej wyłapać brakujące pola)
 */
export function t(key: string, lang: Lang): string {
    const d = dicts[lang] ?? dicts.en;
    return (d && d[key]) ?? dicts.en[key] ?? key;
}

/**
 * Pozwala dodać/ nadpisać słownik w runtime (np. po lazy-load).
 */
export function registerDict(lang: Lang, dict: Dict) {
    dicts[lang] = dict;
}

/**
 * Prosty helper do sprawdzenia, czy klucz istnieje w danym języku.
 * Może się przydać w testach lub warnach devowych.
 */
export function hasKey(key: string, lang: Lang): boolean {
    const d = dicts[lang] ?? dicts.en;
    return !!(d && d[key]);
}
