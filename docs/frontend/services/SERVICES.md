## Services

### HttpWrapper
Location: `frontend/src/services/axiosWrapper.service.ts`
- Base URL: `${schema}://${host}:${port}/` from `frontend/src/config.json`
- Methods:
  - `post<T, R>(url: string, data: T): Promise<AxiosResponse<R>>`
  - `get<R>(url: string): Promise<AxiosResponse<R>>`
- Example:
```ts
await HttpWrapper.post('api/users/login', { email, password });
```

### ChartsService
Location: `frontend/src/services/charts.service.ts`
- `getWinRateData(gameName: string, gameData: RecentGames[]): WinRateDiagramData`
- `getWeekReportData(gameName: string, historyOfUserGames: RecentGames[]): WeekReportData[]`
- Example:
```ts
const pieData = ChartsService.getWinRateData('Chess', recentGames);
const weekData = ChartsService.getWeekReportData('Chess', recentGames);
```
