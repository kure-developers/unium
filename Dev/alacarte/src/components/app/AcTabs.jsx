//-------------------------------------------------------------------------------

import React from 'react'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import _ from 'lodash'

import AcGrid from './AcGrid'

import * as App from '../../actions/App'
import * as Actions from '../../actions/Tabs'


//-------------------------------------------------------------------------------

class AcTabs extends React.Component {

  onRemoveTab = () => {
    
    const { dispatch, tabs } = this.props
    const curTab = tabs.state.curTab
    const tab = tabs.byId[ curTab ]

    const keys = Object.keys( tabs.byId )
    const remainingTabs = _.reject( keys, (id) => id === `${curTab}` )
    const selectTab = remainingTabs.length > 0 ? parseInt( _.first( remainingTabs ) ) : -1

    dispatch( App.Confirm(
      'Remove Tab',
      "Are you sure you want to remove '" + tab.name + "'",
      (id) => dispatch( Actions.TabRemove( id, selectTab ) ),
      curTab
    ))
  }

  //-------------------------------------------------------------------------------

  onAddTabConfirm = ( s ) => {
    
    const { dispatch, tabs } = this.props
    
    const keys  = _.map( _.keys( tabs.byId ), (k) => parseInt(k) )
    const id    = keys.length === 0 ? 1 : _.max( keys ) + 1
        
    dispatch( Actions.TabCreate( id, s.name ) )
  }
    
  onSelectTab = (id) => {

    const { dispatch } = this.props
    const tabId = parseInt( id, 10 )

    if( tabId === -1 ) {
      dispatch( App.AddTab( this.onAddTabConfirm ) )
    } else {
      dispatch( Actions.TabSelect( tabId ) )
    }
  }


  //-------------------------------------------------------------------------------

  createTab = ( tab ) => {

    const { tabs }    = this.props
    const { curTab }  = tabs.state

    const title = (
      <span>
        { tab.name } &nbsp;
        { tab.id === curTab &&
          <FontAwesome name='times' style={{fontSize:'10px'}} onClick={ this.onRemoveTab }/>
        }
      </span>
    )

    return (
      <Tab
        key     = { `tab_${tab.id}` }
        eventKey= { tab.id }
        title   = { title }
        mountOnEnter
      >
        <AcGrid tabId={tab.id} layout={tab.layout} />
      </Tab>
    )
  }


  //-------------------------------------------------------------------------------

  render() {

    const { tabs } = this.props
    const { curTab }  = tabs.state

    return (
      <Tabs
        id        = "tabs"
        className = 'acTabs'
        activeKey = {curTab}
        onSelect  = { this.onSelectTab }
      >
        { _.values( tabs.byId ).map( this.createTab ) }
        <Tab eventKey={-1} title="+" />
      </Tabs>
    )
  }
}

const mapStateToProps = ( state, ownProps ) => {
  return {
    tabs: state.tabs
  }
}

export default connect( mapStateToProps )( AcTabs );

