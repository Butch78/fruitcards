# Fruit Cards Application

Watch command:
```bash
cargo watch -x "shuttle run"
```

Qdrant Command:
```bash
# With env variable
docker run -p 6333:6333 -p 6334:6334 \
    -e QDRANT__SERVICE__GRPC_PORT="6334" \
    qdrant/qdrant
```