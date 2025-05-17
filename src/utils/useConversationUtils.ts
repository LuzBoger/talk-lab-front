export function useConversationUtils() {
    
const getCurrentTime = () : string => {
  return new Date().toLocaleString();
}

return {
    getCurrentTime
}

}