import {ApolloClient, HttpLink, InMemoryCache, split} from '@apollo/client';
import {getMainDefinition} from '@apollo/client/utilities';
import {GraphQLWsLink} from '@apollo/client/link/subscriptions';
import {createClient} from 'graphql-ws';

const hostname = window.location.hostname
const port = window.location.port

const subscriptionUrl = `ws://${hostname}:${port}/subscription`

console.log('Subscription uri: ' + subscriptionUrl)

const httpLink = new HttpLink({
  uri: '/graphql'
});

const wsLink = new GraphQLWsLink(createClient({
  url: subscriptionUrl,
}));

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

let _client: ApolloClient<any>
export const getApolloClient = () => _client
    ? _client
    : _client = new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache(),
    });
