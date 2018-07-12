import * as React from 'react';

import { CaTable } from 'components/CaTable';
import { CaUsersTablesProps, CaUsersTablesState } from './CaUsersTables.model';
import './CaUsersTables.scss';


import {Tabs, Tab} from '@material-ui/core';

import {StatTab} from 'models';

enum HeaderNamesBestUsers {
  name =  'User name',
  playedTime = 'Played time',
  Score = 'Score'
}

enum HeaderNamesTheMostPopularGames {
  name =  'Game',
  playedInWeek = 'Played in week',
  playerAll = 'Played all'
}

enum HeaderNamesRecentGames {
  game =  'Game',
  score = 'Score',
  result = 'Result'
}

export class CaUsersTables extends React.Component<CaUsersTablesProps, CaUsersTablesState> {    
    
  constructor(props: CaUsersTablesProps) {
    super(props);
    this.state = { 
      value: 0,
      rowData: [
        ...this.props.statistic.bestUsers
      ],
      columnDef: [
        'User name', 'Played time', 'Score'
      ]
      };
  }

  public render(): JSX.Element {

    return (
      <div>
        <h2 className="ca-users-tables__title">Statistic</h2>
        <Tabs value={this.state.value} className="ca-users-tables__tabs">
          <Tab label="The best users" onClick={() => this.changeContent(StatTab.BestUsers)}  className="ca-users-tables__tab_first-table"/>
          <Tab label="The most popular games" onClick={() => this.changeContent(StatTab.TheMostPopularGames)}  className="ca-users-tables__tab_second-table"/>
          <Tab label="Recent games" onClick={() => this.changeContent(StatTab.RecentGames)}  className="ca-users-tables__tab_third-table"/>
        </Tabs>

        <CaTable rowData={this.state.rowData} columnDef={this.state.columnDef}/>
      </div>
    );
  }

  public changeContent(value: number): void {

    switch(value) {
      case StatTab.BestUsers: {
        // const columnDef = ['User name', 'Played time', 'Score'];

        const propertyNames = Object.keys(this.props.statistic.bestUsers[0]);
        const headersName: string[] = [];

        propertyNames.forEach(property => 
          headersName.push(HeaderNamesBestUsers[property])
        );

        const columnDef = [...headersName];

        const rowData = this.props.statistic.bestUsers.map(userStatistic => {
          const newUserStatistic = {...userStatistic};
          for (const kindOfStatistic in newUserStatistic) {

            if(newUserStatistic.hasOwnProperty(kindOfStatistic)) {
              if(kindOfStatistic === 'name') {
                newUserStatistic[kindOfStatistic] = newUserStatistic[kindOfStatistic]
              }

              if(kindOfStatistic === 'playedTime') {
                newUserStatistic[kindOfStatistic] = newUserStatistic[kindOfStatistic] + ' minutes'
              }

              if(kindOfStatistic === 'Score') {
                newUserStatistic[kindOfStatistic] = newUserStatistic[kindOfStatistic]
              }
            }
            
          }
          return newUserStatistic
        })

        this.setState({
          value,
          rowData,
          columnDef
        })
        break;
      }

      case StatTab.TheMostPopularGames: {
        // const columnDef = ['Game', 'Played in week', 'Played all'];

        const propertyNames = Object.keys(this.props.statistic.mostPopularGames[0]);
        const headersName: string[] = [];

        propertyNames.forEach(property => 
          headersName.push(HeaderNamesTheMostPopularGames[property])
        );

        const columnDef = [...headersName];


        const rowData = this.props.statistic.mostPopularGames.map(userStatistic => {
          const newUserStatistic = {...userStatistic};
          for (const kindOfStatistic in newUserStatistic) {

            if(newUserStatistic.hasOwnProperty(kindOfStatistic)) {
              if(kindOfStatistic === 'name') {
                newUserStatistic[kindOfStatistic] = newUserStatistic[kindOfStatistic]
              }

              if(kindOfStatistic === 'playedInWeek') {
                newUserStatistic[kindOfStatistic] = newUserStatistic[kindOfStatistic] + ' minutes'
              }

              if(kindOfStatistic === 'playerAll') {
                newUserStatistic[kindOfStatistic] = newUserStatistic[kindOfStatistic] + ' minutes'
              }
            }
            
          }
          return newUserStatistic
        })

        this.setState({
          value,
          rowData,
          columnDef
        })
        break;
      }

      case StatTab.RecentGames: {

        // const columnDef = ['Game', 'Score', 'Result'];
        const propertyNames = Object.keys(this.props.statistic.recentGames[0]);
        const headersName: string[] = [];

        propertyNames.forEach(property => 
          headersName.push(HeaderNamesRecentGames[property])
        );

        const columnDef = [...headersName];



        const rowData = this.props.statistic.recentGames.map(userStatistic => {
          const newUserStatistic = {...userStatistic};
          for (const kindOfStatistic in newUserStatistic) {

            if(newUserStatistic.hasOwnProperty(kindOfStatistic)) {
              if(kindOfStatistic === 'game') {
                newUserStatistic[kindOfStatistic] = newUserStatistic[kindOfStatistic]
              }

              if(kindOfStatistic === 'Score') {
                newUserStatistic[kindOfStatistic] = newUserStatistic[kindOfStatistic] + ' minutes'
              }

              if(kindOfStatistic === 'result') {
                if(newUserStatistic[kindOfStatistic] === true) {
                  newUserStatistic[kindOfStatistic] = 'W'
                } else {
                  newUserStatistic[kindOfStatistic] = 'L'
                }
              }
            }
            
          }
          return newUserStatistic
        })

        this.setState({
          value,
          rowData,
          columnDef
        })
        break;
      }
    }
  }
} 
