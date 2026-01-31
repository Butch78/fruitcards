export default defineEventHandler(async (event) => {
  const auth = useServerAuth(event);
  return auth.handler(toWebRequest(event));
});
