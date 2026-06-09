package ai

import (
	"bytes"
	"encoding/json"
	"net/http"
	"os"
)

type Client struct {
	APIKey string
}

func NewClient(cfg any) *Client {
	return &Client{
		APIKey: os.Getenv("OPENAI_API_KEY"),
	}
}

func (c *Client) Generate(prompt string) (string, error) {

	body := map[string]any{
		"model": "gpt-4o-mini",
		"messages": []map[string]string{
			{
				"role": "user",
				"content": prompt,
			},
		},
	}

	jsonBody, _ := json.Marshal(body)

	req, _ := http.NewRequest(
		"POST",
		"https://api.openai.com/v1/chat/completions",
		bytes.NewBuffer(jsonBody),
	)

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+c.APIKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var result map[string]any
	json.NewDecoder(resp.Body).Decode(&result)

	choices := result["choices"].([]any)
	msg := choices[0].(map[string]any)["message"].(map[string]any)["content"].(string)

	return msg, nil
}