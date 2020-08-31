import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Row, Table, FormGroup, Input, Fade, Label } from 'reactstrap';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction
} from "@material-ui/core";
import RootRef from "@material-ui/core/RootRef";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ReorderIcon from '@material-ui/icons/Reorder';
import AddIcon from '@material-ui/icons/Add';
import AddDiningOption from "./AddDiningOptions";
import Divider from '@material-ui/core/Divider';
// a little function to help us with reordering the result

// const getItemStyle = (isDragging, draggableStyle) => (
//   console.log(isDragging,draggableStyle),
//   {
//   // styles we need to apply on draggables
//   ...draggableStyle,

//   ...(isDragging)
// });
const grid = 12;

const getListStyle = isDraggingOver => ({
  // background: isDraggingOver ? 'lightblue' : '',
  
  // padding: grid,
  width:"100%",
  overflow: 'auto',
});

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  width:"100%",
  // change background colour if dragging
  // styles we need to apply on draggables
  ...draggableStyle,
});

// const getListStyle = isDraggingOver => ({
//   background: isDraggingOver ? 'lightblue' : 'lightgrey',
  // display: 'flex',
  // padding: grid,
  // overflow: 'auto',
// });


class DiningOptions extends Component {
    constructor(props){
        super(props);
        this.state = {
            checked: [false, false],
            fadeDiningOption: true,
            fadeAddDiningOption: false,
            timeout: 300,
            items1: this.getItems(),
            items2: this.getItems(),
        }
    }
    getItems = () => {
      let data = [1,2,3].map(k => ({
         id: `item-${k}`,
         value: `item ${k}`
       }));
       return data;
     }
 
    reorder = (list, startIndex, endIndex) => {
        console.log(list)
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
    
      return result;
    };
    
    onDragEnd = (result) => {
        // dropped outside the list
      
          if (!result.destination) {
            return;
          }
      
          const items1 = this.reorder(
            this.state.items1,
            result.source.index,
            result.destination.index
          );
          
          this.setState({
            items1
          });
      }
      onDragEnd2 = (result) => {
        // dropped outside the list
      
          if (!result.destination) {
            return;
          }
      
          const items2 = this.reorder(
            this.state.items2,
            result.source.index,
            result.destination.index
          );
          
          this.setState({
            items2
          });
      }
      addDiningOpt = () =>{
        this.setState({
            fadeDiningOption: false,
            fadeAddDiningOption: true
        });
      }
      goBack = () =>{
        this.setState({
          fadeDiningOption: true,
          fadeAddDiningOption: false
        });
      }
  render() {
      const { timeout, fadeDiningOption, fadeAddDiningOption } = this.state;
    return (
      <div className="animated fadeIn">
          {fadeAddDiningOption ? <Fade timeout={timeout} in={fadeAddDiningOption}>
            <AddDiningOption goBack={this.goBack} />
          </Fade>
          :""}
          {fadeDiningOption ? <Fade timeout={timeout} in={fadeDiningOption}>
            <Row>
            <Col xs="12" lg="12">
                <Card>
                <CardHeader>
                  <Row>
                    <Col xs="12" lg="6">
                          <Button color="success" onClick={this.addDiningOpt}>
                      <i className="fa fa-plus"></i> ADD DINING OPTION
                          </Button>
                    </Col>
                    <Col xs="12" lg="6">
                      <FormGroup>
                        <Input type="select" name="store" id="store">
                          <option value="">All stores</option>
                          <option value="store1">Store 1</option>
                          <option value="store2">Store 2</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>    
                </CardHeader>
                <CardBody>
                    <Row>
                        <h3>Store 1</h3>
                        <Col xs="12" lg="12">
                        <Row style={{marginBottom: "1%"}}>
                                            <Col xs="4" className=" mt-3">
                                            Name
                                            </Col>
                                            <Col xs="4" className=" mt-3">
                                            Category
                                            </Col>
                                        </Row>
                                        <Divider />
                            {/* Dragable Component */}
                            <DragDropContext onDragEnd={this.onDragEnd}>
                              <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                  <RootRef rootRef={provided.innerRef}>
                                    <Row>
                                    <List style={getListStyle(snapshot.isDraggingOver)}>
                                        
                                      {this.state.items1.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                          {(provided, snapshot) => (  
                                            <ListItem
                                              ContainerComponent="li"
                                              ContainerProps={{ ref: provided.innerRef }}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                              )}
                                              divider={true}
                                            >
                                                <Col xs="4" className="mt-3">
                                                 {item.value}
                                                </Col>
                                                <Col xs="4" className="mt-3">
                                                 {item.value}
                                                </Col>
                                                <Col xs="4" className="mt-3">
                                                <span className="pull-right">  
                                                    <ListItemIcon>
                                                    <ReorderIcon />
                                                  </ListItemIcon>
                                                  </span>
                                                  </Col>
                                              <ListItemSecondaryAction>
                                              </ListItemSecondaryAction>
                                            </ListItem>
                                          )}
                                          
                                        </Draggable>
                                       
                                      ))}
                                      {provided.placeholder}
                                      
                                    </List>
                                    </Row>
                                  </RootRef>
                                )}
                              </Droppable>
                            </DragDropContext>
                            {/* END Dragable Component */}
                        </Col>
                        <h3>Store 2</h3>
                        <Col xs="12" lg="12">
                            {/* Dragable Component */}
                            <DragDropContext onDragEnd={this.onDragEnd2}>
                              <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                  <RootRef rootRef={provided.innerRef}>
                                    <List style={getListStyle(snapshot.isDraggingOver)}>
                                        <Row style={{paddingLeft: "16px", marginBottom: "1%"}}>
                                            <Col xs="4" className=" mt-3">
                                            Name
                                            </Col>
                                            <Col xs="4" className=" mt-3">
                                            Category
                                            </Col>
                                        </Row>
                                        <Divider />
                                      {this.state.items2.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                          {(provided, snapshot) => (
                                            <ListItem
                                              ContainerComponent="li"
                                              ContainerProps={{ ref: provided.innerRef }}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                              )}
                                              divider={true}
                                            >
                                                <Col xs="4" className="pull-left mt-3">
                                                {item.value}
                                                </Col>
                                                <Col xs="4" className=" mt-3">
                                                {item.value}
                                                </Col>
                                                <Col xs="4" className=" mt-3">
                                                <span className="pull-right">  
                                                    <ListItemIcon>
                                                    <ReorderIcon />
                                                  </ListItemIcon>
                                                  </span>
                                                  </Col>
                                              <ListItemSecondaryAction>
                                              </ListItemSecondaryAction>
                                            </ListItem>
                                            
                                          )}
                                        </Draggable>
                                       
                                      ))}
                                      {provided.placeholder}
                                    </List>
                                  </RootRef>
                                )}
                              </Droppable>
                            </DragDropContext>
                            {/* END Dragable Component */}
                        </Col>
                    </Row>
                </CardBody>
                </Card>
            </Col>
            </Row>
          </Fade>
          :""}
      </div>

    );
  }
}

export default DiningOptions;
