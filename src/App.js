import React,{ Fragment } from 'react';
import './App.css';
import axios from 'axios'
import { Label,Icon,Table } from 'semantic-ui-react'
import $ from 'jquery'

class App extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      keyvalueList: [],
      file:null,
      response_data:[],
      loader: false,
      labels: [ "url", "name" ],
      editLabels: true
    }

    this.fileInputRef = React.createRef();


    this.handleChange = this.handleChange.bind(this)
    this.addnewPair = this.addnewPair.bind(this)
    this.fetchData = this.fetchData.bind(this)
  }

  handleChange(event){
    const {name,value} = event.target
    const name_split = name.split('_')
    this.setState( prevState => {
      const newkeyvaluelist = prevState.keyvalueList.map( (valuePair,index) => {
        if( parseInt(name_split[1]) === index ){
          return { ...valuePair, [name_split[0]]: value }
        }
        return valuePair
      })
      return { keyvalueList: newkeyvaluelist }
    })
  }

  addnewPair(event){
    event.preventDefault()
    const tempList = this.state.keyvalueList
    tempList.push(Object.assign({}, ...this.state.labels.map((value) => { return {[value]: ""}} )) )
    this.setState({keyvalueList: tempList })
  }

  fetchData(event){
    event.preventDefault()

    // add condition for file validation
    if ( this.state.file !== null ){
      $('#errormsg').hide()
      let data = new FormData()
      data.append("file", this.state.file, this.state.file.name)
      data.append('data', JSON.stringify({data: this.state.keyvalueList}))

      // for (var value of data.values()) {
      //   console.log(value);
      // }


      this.setState({ loader: true })
      axios
          .post('/api/fetchData', data)
          .then(response => {
              this.setState({ response_data: response })
          })
          .catch(err => {
              console.log(err)
              this.setState({ loader: false })
              $('#root').append(`<div class="msg" style="background-color: rgb(221, 103, 103)"> ${err} </div>`)
          });
      }
      else{
        $('#errormsg').show()
      }

  }

  camelCase(str){
    let list = str.split(' ')
    list.forEach((value,index) => {
      list[index] = value[0].toUpperCase()+value.substring(1)
    })
    return list.join(' ')
  }

  render(){


    const valueTabs = this.state.keyvalueList.map(( valuePair,index) => {
                        return <div className="valuesTab" key={index} >
                                    <div className="valuesHeader"> Heading </div>
                                    <div className="valuesBody" >
                                      {
                                          Object.keys( valuePair ).map( (label,index1) =>{
                                            return <Fragment key={ index1 }>
                                                      <label>{ this.camelCase(label) }: </label>
                                                      <input type="text" name={`${label}_${index}`} placeholder={ `${this.camelCase(label)}` } value={valuePair[label]} onChange={this.handleChange} />
                                                    </Fragment>
                                          })
                                      }
                                     {/* 
                                      <label>Id: </label>
                                      <input type="text" name={`id_${index}`} placeholder="Id" value={valuePair.id} onChange={this.handleChange} />
                                    */}
                                    </div>
                                </div>
                      })
    const labelsList = this.state.labels.map((value,index) => {
                            return <li key={index}> { value } <Icon name="close" style={{cursor: 'pointer'}} onClick={event => this.setState({ labels: this.state.labels.filter(x => x!== value) }) } /></li>
                        })
    // console.log(this.state.file)
    return (
      <div className="App">
        <header className="App-header">
          App Heading
        </header>
          { ( this.state.editLabels ) ?
              <main className="labelsBox">
                <div className="main_labels">
                    <h1>Labels</h1>
                    <ul className="labelList" >
                        { labelsList }
                    </ul>
                    <input type="text" placeholder="Add new label" className="newlabel" 
                              onKeyUp={event => {if(event.keyCode === 13) { this.setState(prevState => { 
                                                const newlabels = this.state.labels
                                                if(!newlabels.includes($('.newlabel').val()) && $('.newlabel').val() !== '') {
                                                  newlabels.push($('.newlabel').val())
                                                  $('.newlabel').val('')
                                                }
                                                return {labels: newlabels} }) }
                                      }}/>
                    <br/>
                    <Label content="use Labels" style={{border: '1px solid #9c9191',cursor: 'pointer',fontWeight: 'bold',float: 'right'}} onClick={event => { if(this.state.keyvalueList.length === 0) this.addnewPair(event);this.setState({editLabels: false}) }}/>
                </div>
              </main>
            :
            <main>
                <div className="tab">
                    <div style={{textAlign: 'end'}} >
                      <Label icon="plus" content="Add New" style={{border: '1px solid #9c9191',cursor: 'pointer',fontWeight: 'bold'}} onClick={this.addnewPair} />
                    </div>
                    
                    { valueTabs }
     
                </div>
                <div className="tab">
                    <div className="fileupload" onClick={() => { this.fileInputRef.current.click() }} >
                          <Icon name="file alternate outline" style={{ float: 'left' }} /> {(this.state.file !== null) ? this.state.file.name : 'Import File'}
                      </div>
                      <input
                          ref={this.fileInputRef}
                          type="file"
                          hidden onChange={(event) => {
                              if ( event.target.files.length > 0 ){ $('#errormsg').hide()
                                  this.setState({ file: event.target.files[0] }) }
                          }}
                      />
                      <p id="errormsg" style={{ color: 'red',display: 'none',margin: '0',padding: 0 }} > required* </p>
                      <Label style={{ float: 'right',margin: '5px 0 15px',border: '1px solid #b5b5b5',backgroundColor: '#2185d0',color: 'white',fontSize:'medium',fontWeight:'bolder' }} onClick={this.fetchData} content="Crawl" />

                      { this.state.response_data.length > 0 ? 
                          <Table>
                            <tbody>
                              <tr><td>  response </td></tr>
                            </tbody>
                          </Table>
                        :null
                      }
                </div>
            </main>
          }


      </div>
    )
  }
}

export default App;
