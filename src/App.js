import React from 'react';
import './App.css';
import axios from 'axios'
import { Label,Icon,Table,Button } from 'semantic-ui-react'
import $ from 'jquery'

class App extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      keyvalueList: [{name:"",id:"",desc:""}],
      file:null,
      response_data:[],
      loader: false
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
    tempList.push({ name: "",id: "",desc: "" })
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

  render(){


    const valueTabs = this.state.keyvalueList.map(( valuePair,index) => {
                        return <div className="valuesTab" key={index} >
                                    <div className="valuesHeader"> Heading </div>
                                    <div className="valuesBody" >
                                      <label>Id: </label>
                                      <input type="text" name={`id_${index}`} placeholder="Id" value={valuePair.id} onChange={this.handleChange} />
                                      
                                      <label>Name: </label>
                                      <input type="text" name={`name_${index}`} placeholder="Name" value={valuePair.name} onChange={this.handleChange} />

                                      <label>Description: </label>
                                      <input type="text" name={`desc_${index}`} placeholder="Description" value={ valuePair.desc } onChange={this.handleChange} />
                                    </div>
                                </div>
                      })

    // console.log(this.state.file)
    return (
      <div className="App">
        <header className="App-header">
          App Heading
        </header>
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
                  <Button primary style={{ float: 'right',margin: '5px 0 15px',border: '1px solid #b5b5b5' }} onClick={this.fetchData}  >Crawl</Button>

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
      </div>
    )
  }
}

export default App;
