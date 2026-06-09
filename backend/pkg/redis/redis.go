// pkg/redis/redis.go
package redis

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
)

var Ctx = context.Background()

func NewClient() *redis.Client {

	rdb := redis.NewClient(&redis.Options{
		Addr:         "localhost:6379",

		// 🔥 performance tuning
		PoolSize:     20,
		MinIdleConns: 5,

		// 🔥 timeout safety (important)
		DialTimeout:  5 * time.Second,
		ReadTimeout:  3 * time.Second,
		WriteTimeout: 3 * time.Second,

		// optional (kalau pakai password Redis)
		// Password: "",
	})

	// 🔥 health check (IMPORTANT)
	_, err := rdb.Ping(Ctx).Result()
	if err != nil {
		panic("Redis connection failed: " + err.Error())
	}

	return rdb
}