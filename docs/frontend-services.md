## Frontend Services

### HttpWrapper
- File: `frontend/src/services/axiosWrapper.service.ts`
- Base URL derived from `frontend/src/config.json` (`backEndPath`)
- Methods:
```ts
HttpWrapper.post<T, R>(url: string, data: T): Promise<AxiosResponse<R>>
HttpWrapper.get<R>(url: string): Promise<AxiosResponse<R>>
```
- Examples:
```ts
const res = await HttpWrapper.post('api/users/login', { email, password });
const list = await HttpWrapper.get('api/games/get-games');
```

### ChartsService
- File: `frontend/src/services/charts.service.ts`
- Methods:
```ts
ChartsService.getWinRateData(gameName: string, gameData: RecentGames[]): WinRateDiagramData
ChartsService.getWeekReportData(gameName: string, history: RecentGames[]): WeekReportData[]
```
- Example:
```ts
const pie = ChartsService.getWinRateData('Chess', recentGames);
const bars = ChartsService.getWeekReportData('Chess', recentGames);
```
