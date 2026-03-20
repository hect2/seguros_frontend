import { NoveltyTypesCatalog } from "./novelty.types.catalog.interface";

export interface NoveltyTypesCatalogResponse {
    current_page:   number;
    data:           NoveltyTypesCatalog[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links:          Link[];
    next_page_url:  string;
    path:           string;
    per_page:       number;
    prev_page_url:  null | string;
    to:             number;
    total:          number;
}

export interface Link {
    url:    null | string;
    label:  string;
    page:   number | null;
    active: boolean;
}
