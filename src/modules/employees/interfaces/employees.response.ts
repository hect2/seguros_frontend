export interface EmployeesResponse {
  current_page:   number;
  data:           Data[];
  first_page_url: string;
  from:           number;
  last_page:      number;
  last_page_url:  string;
  links:          Link[];
  next_page_url:  null;
  path:           string;
  per_page:       number;
  prev_page_url:  string;
  to:             number;
  total:          number;
}

export interface Data {
  id:          number;
  full_name:   string;
  dpi:         string;
  birth_date:  Date;
  phone:       string;
  email:       string;
  status_slug: string;
  status_name: string;
  files:       Files;
  data:        ExtraData;
}

export interface ExtraData {
  office_code:        string;
  district_code:      string;
  admin_position:     string;
  operative_position: null | string;
}

export interface Files {
  files:             File[];
  description_files: null;
}

export interface File {
  url:           string;
  path:          string;
  type:          string;
  uuid:          string;
  filename:      string;
  mime_type:     string;
  size_bytes:    number;
  uploaded_at:   Date;
  date_emission: Date;
}

export interface Link {
  url:    null | string;
  label:  string;
  page:   number | null;
  active: boolean;
}
