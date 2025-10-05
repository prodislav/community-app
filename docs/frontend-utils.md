## Frontend Utilities

### createStyled
- File: `frontend/src/utils/createStyled.tsx`
- Purpose: Helper to create a render-prop styled wrapper around Material-UI `withStyles`.
- Signature:
```ts
function createStyled<T>(styles: T): (props: { children: (p: { classes: Classes<T> }) => JSX.Element }) => JSX.Element
```
- Example:
```tsx
const Styled = createStyled(styles);
<Styled>{({ classes }) => <div className={classes.root}>Hello</div>}</Styled>
```

### history
- File: `frontend/src/utils/history.ts`
- Exports: `history` (hash history)
- Example:
```ts
import { history } from 'utils';
history.push('/home');
```

### setAuthToken / deleteAuthToken
- File: `frontend/src/utils/setAuthToken.ts`
- Purpose: Set/remove axios default Authorization header
- Signatures:
```ts
setAuthToken(token: string): void
deleteAuthToken(): void
```
- Example:
```ts
setAuthToken('Bearer <JWT>');
// later
deleteAuthToken();
```

### getCurrentLanguage / getCurrentLanguageFromLocalStorage
- File: `frontend/src/utils/getLanguage.ts`
- Signatures:
```ts
getCurrentLanguage(i18n: i18n): string
getCurrentLanguageFromLocalStorage(): string
```

### isEmpty
- File: `frontend/src/utils/isEmpty.ts`
- Signature: `isEmpty<T>(value: T): boolean`
- Semantics: Checks for undefined, null, empty object, or blank string

### isObjectsEqual
- File: `frontend/src/utils/isObjectsEqual.ts`
- Signature: `isObjectsEqual(a: object, b: object): boolean`

### Omit
- File: `frontend/src/utils/Omit.ts`
- Type utility:
```ts
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
```

### i18n
- File: `frontend/src/utils/i18n.ts`
- Exports: `i18nInstance`
- Usage:
```ts
import { i18nInstance } from 'utils/i18n';
i18nInstance.t('key');
```

### translateNumberOfWeekToItsName
- File: `frontend/src/utils/translateNumberOfWeekToItsName.ts`
- Signature: `(day: number) => string`
- Returns: English weekday name
