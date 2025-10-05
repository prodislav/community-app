## Utils

### history
- `history`: Hash history instance

### setAuthToken / deleteAuthToken
- `setAuthToken(token: string)`: sets Axios default Authorization header
- `deleteAuthToken()`: removes Axios default Authorization header

### isEmpty
- Generic check for empty values, empty objects, or whitespace strings

### getLanguage
- `getCurrentLanguage(i18n: i18n): string`
- `getCurrentLanguageFromLocalStorage(): string`

### i18nInstance
- Initialized i18n with `en` and `ru` locales

### isObjectsEqual
- Shallow equality by own properties

### Omit
- Type helper: `Omit<T, K extends keyof T>`

### translateNumberOfWeekToItsName
- Converts `DaysOfWeek` number to weekday name
