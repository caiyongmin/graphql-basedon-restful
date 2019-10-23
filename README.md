# GraphQL-Basedon-RESTful

Showcase about GraphQL server based on RESTful API server with focus on easy setup, performance and great developer experience. see this article([基于 RESTful API 的 GraphQL 服务构建](https://zhuanlan.zhihu.com/p/78962152)) for more information.

## Run

```bash
# install dependencies
yarn

# run koa server
npm run examples:koa

# run mock restful server
npm run start:json
```

*Tips: project does not have hot module reload, if you have modify the code, you need to rebuild it & db.json will be reset.

## Examples

- [mutation: create user](#create-user)
- [query: query user](#query-user)
- [graph query: user graph](#query-user-graph)
- [N+1 problem example](#n1-problem)

[Altair GraphQL Client](https://altair.sirmuel.design) is recommended for debugging.

### Create user

<a href="#examples" style="font-size: 14px">↥ back to examples</a>

```gql
mutation createUser($body: UserInput!) {
  createUser(body: $body) {
    name
  }
}
```

variables:

```json
{
  "body": {
    "name": "gogogo111",
    "orderId": 1,
    "productId": 1
  }
}
```

![create user](./guide/create-user.png)

### Query user

<a href="#examples" style="font-size: 14px">↥ back to examples</a>

```gql
query {
  user(userId: 1) {
    name
  }
}
```

![query user](./guide/query-user.png)

### Query user graph

<a href="#examples" style="font-size: 14px">↥ back to examples</a>

```gql
query {
  user(userId: 1) {
    name
    orders {
      price
      user {
        name
        orders {
          price
        }
      }
    }
    collections {
      title
    }
  }
}
```

![query-user-graph](./guide/query-user-graph.png)

### N+1 Problem

<a href="#examples" style="font-size: 14px">↥ back to examples</a>

```gql
query {
  products {
    id
    title
    users(productId: 1) {
      name
    }
  }
}
```

```bash
# product users will only request once, not three

GET /products 200 3.528 ms - 437
GET /products/1/users 200 4.274 ms - 84
```

![n+1-problem](./guide/n+1-problem.png)

## Refs

Thank you here!

- [GraphQL-BFF：微服务背景下的前后端数据交互方案](https://zhuanlan.zhihu.com/p/75241522)
- [第一届 GraphQLParty 首场工程实践图文版](https://zhuanlan.zhihu.com/p/38283930)
- [GraphQL Tools - Schema directives](https://www.apollographql.com/docs/graphql-tools/schema-directives/)
- [the-power-of-graphql-directives](https://callstack.com/blog/the-power-of-graphql-directives/)
- [GraphQL Tools - Mocking](https://www.apollographql.com/docs/graphql-tools/mocking/)

Welcome to commit issue and pull request!
