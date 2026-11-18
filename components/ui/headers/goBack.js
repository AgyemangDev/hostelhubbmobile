/** Back if there is somewhere to go back to, otherwise home. */
export const goBack = (router) => (router.canGoBack() ? router.back() : router.replace("/(tabs)/(index)"));
