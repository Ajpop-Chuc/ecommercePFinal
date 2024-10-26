/**
 * Invoices List
 */
/* eslint-disable */
import React, { Component, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { useTable, usePagination } from 'react-table'
//firebase
import firebase from '../../../firebase';
//component
import ContentLoader from '../../../components/global/loaders/ContentLoader';
import ConfirmationBox from './components/ConfirmationBox';
import InvoicePopup from './components/InvoicePopup';


function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  )

  // Render the UI for your table
  return (
    <div className="ReactTable">
      <table {...getTableProps()} className="rt-table">
        <thead className="rt-thead -header">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} className="rt-tr">
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} className="rt-th"> {column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="rt-tbody">
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} className="rt-tr">
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()} className="rt-td">{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="pagination-bottom">
         <div className="-pagination ">
            <div className="-previous">
              <button className="-btn" type="button" onClick={() => previousPage()} disabled={!canPreviousPage}>
                Previous
              </button>
            </div>
            <div className="-center">
              <span className="-pageInfo">
                Page{' '}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>{' '}
              </span>
              <span className="select-wrap -pageSizeOptions">
                 <select
                   value={pageSize}
                   onChange={e => {
                     setPageSize(Number(e.target.value))
                   }}
                 >
                   {[10, 20, 30, 40, 50].map(pageSize => (
                     <option key={pageSize} value={pageSize}>
                       Show {pageSize}
                     </option>
                   ))}
                 </select>
               </span>
            </div>
            <div className="-next"> 
               <button className="-btn" type="button" onClick={() => nextPage()} disabled={!canNextPage}>
                  Next
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}

class InvoiceList extends Component {
   constructor(props) {
      super(props);
      this.confirmationDialog = React.createRef();
   }

   state = {
      name: '',
      invoiceList: null,
      searchClientText: '',
   };

   allUserInvoice = [];     //all clients data

   handleChange = name => event => {
      this.setState({ [name]: event.target.value });
   };
   componentDidMount() {
      this.getInvoiceData();
   }

   //get invoice list
   getInvoiceData() {
      const invoiceListRef = firebase.database().ref('invoice_list');
      invoiceListRef.on('value', (snapshot) => {
         let invoiceList = snapshot.val();
         this.setState({
            invoiceList: invoiceList
         });
         this.allUserInvoice = invoiceList;
      });
   }
   onSearchClient(searchText) {
      if (searchText === '') {
         this.setState({
            ...this.state,
            invoiceList: this.allUserInvoice,
            searchClientText: searchText,
         });
      } else {
         let searchClients = this.allUserInvoice.filter((invoice) => {
            if (searchText === searchText.toLowerCase()) {
               let buyer = invoice.buyer.toLowerCase().indexOf(searchText.toLowerCase()) > -1
               return (
                  buyer
               )
            }
            else {
               let buyer = invoice.buyer.toUpperCase().indexOf(searchText.toUpperCase()) > -1
               return (
                  buyer
               )
            }
         });
         this.setState({
            ...this.state,
            searchClientText: searchText,
            invoiceList: searchClients
         })
      }
   }

   onDeleteCartItem(data) {
      this.data = data;
      this.confirmationDialog.current.openDialog();
   }

   deleteCartItem(popupResponse) {
      if (popupResponse) {
         let deleteItem = this.data;
         let newData = this.state.invoiceList.filter((invoiceListItem) => invoiceListItem.id !== deleteItem.id)
         this.setState({
            invoiceList: newData
         })
      }
   }

   render() {

      const { invoiceList } = this.state;
      const columns = [
         {
            maxWidth: 75,
            Header: 'No.',
            accessor: 'count'
         },
         {
            sortable: false,
            Header: 'Invoice Id',
            accessor: 'id',

         },
         {
            minWidth: 160,
            Header: 'Buyer',
            accessor: 'buyer',
         },
         {
            Header: 'Date',
            accessor: 'date',
         },
         {
            Header: 'Price',
            accessor: 'price',
         },
         {
            Header: 'Payment',
            accessor: 'payment_type',
         },
         {
            Header: 'Status',
            accessor: 'status',
         },
         {
            Header: 'action',
            accessor: 'action',
            Cell: props => {
               return (
                  <div>
                     <InvoicePopup />
                     <Button
                        className="action-btn"
                        onClick={() => this.onDeleteCartItem(props.row.original)}
                     >
                        <i className="material-icons active-color">delete</i>
                     </Button>
                  </div>
               )
            },
         }
      ]
      return (
         <Fragment>
            {invoiceList !== null ?
               <div className="inner-container">
                  <div className="iron-invoice-list-wrap">
                     <div className="page-title mb-20">
                        <h4 className="mb-0">Invoice List</h4>
                     </div>
                     <div className="iron-shadow rounded p-sm-20 p-15 mb-30 bg-base">
                        <Grid container spacing={3} className="my-0">
                           <Grid item xs={12} sm={12} md={6} lg={5} className="py-0 d-sm-flex d-block">
                              <TextField
                                 label="Search Products"
                                 className="my-0 iron-form-input-wrap mr-5"
                                 fullWidth
                                 value={this.state.searchClientText}
                                 onChange={(e) => this.onSearchClient(e.target.value)}
                              />
                           </Grid>
                        </Grid>
                     </div>
                     <div className="iron-shadow rounded p-20 bg-base">
                       
                        <Table columns={columns} data={invoiceList} />

                     </div>
                  </div>
                  <ConfirmationBox
                     ref={this.confirmationDialog}
                     onConfirm={(res) => this.deleteCartItem(res)}
                  />
               </div>
               :
               <ContentLoader />
            }
         </Fragment>
      )
   }
}

export default InvoiceList;