import { quotes } from '~/utils/quotes'

export function useQuote() {
  const storedQuote = useLocalStorage<{ text: string, author: string, date: string }>('pomodear-quote', {
    text: '',
    author: '',
    date: ''
  })

  const today = new Date().toISOString().slice(0, 10)

  if (storedQuote.value.date !== today || !storedQuote.value.text) {
    const seed = today.split('-').reduce((acc, part) => acc + Number(part), 0)
    const index = seed % quotes.length
    storedQuote.value = {
      text: quotes[index]!.text,
      author: quotes[index]!.author,
      date: today
    }
  }

  function updateQuoteText(text: string) {
    storedQuote.value = { ...storedQuote.value, text }
  }

  function updateQuoteAuthor(author: string) {
    storedQuote.value = { ...storedQuote.value, author }
  }

  return {
    currentQuote: storedQuote,
    updateQuoteText,
    updateQuoteAuthor
  }
}
