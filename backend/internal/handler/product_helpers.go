package handler

import "encoding/json"

func decodeStringList(raw string) []string {
	items := []string{}
	if raw == "" {
		return items
	}
	if err := json.Unmarshal([]byte(raw), &items); err != nil {
		return []string{}
	}
	return items
}

func encodeStringList(items []string) string {
	if items == nil {
		items = []string{}
	}
	b, err := json.Marshal(items)
	if err != nil {
		return "[]"
	}
	return string(b)
}
