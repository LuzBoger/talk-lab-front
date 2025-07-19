export function useConversationUtils() {
    
const getCurrentTime = (date: string) : string => {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

const getTimeAgo = (date: string): string => {

  const now = new Date();
  const newDate = new Date(date);
  const seconds = Math.floor((now.getTime() - newDate.getTime()) /1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);


  if(seconds < 60) {
    return  `${seconds} s`
  }

  if(minutes < 60) {
    return `${minutes} min`
  }

  if(hours < 24) {
    return `${hours} h`
  }

  if(days < 30) {
    return `${days} j`
  }

  if(months < 12) {
    return `${months} mois`
  }

   return `${years} an${years > 1 ? 's' : ''}`;
}



return {
    getCurrentTime,
    getTimeAgo
}

}