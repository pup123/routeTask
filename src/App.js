import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerTable from './comopnents/CustomerTable';  // Correct path
import TransactionGraph from './comopnents/TransactionGraph';  // Correct p
import "./App.css"
import { MDBInputGroup } from 'mdb-react-ui-kit';
import "@fortawesome/fontawesome-svg-core"
import 'react-bootstrap';


function App() {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {


    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const customersResponse = await axios.get('https://pup123.github.io/json/data.json');
      const transactionsResponse = await axios.get('https://pup123.github.io/json/data.json');
      setCustomers(customersResponse.data.customers);
      setTransactions(transactionsResponse.data.transactions);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const onSearchChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value === "") {
        fetchData();
    }
};

const onHandelSubmit = () => {
    if (search === '') {
        fetchData();
        return;
    }
    fetch('https://pup123.github.io/json/data.json')
        .then((res) => res.json())
        .then((data) => {
            const filteredData = data.transactions.filter((item) => {
                const customer = customers.find(c => c.id == item.customer_id);
                return (
                    item.amount == search ||
                    (customer && customer.name.toLowerCase().includes(search.toLowerCase()))
                );
            });
            setTransactions(filteredData);
            setSearch('')
        });
};

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };


  const filteredTransactions = selectedCustomer
    ? transactions.filter(transaction => transaction.customerId === selectedCustomer.id)
    : transactions;

  return (
    <div>
       <MDBInputGroup className=' input1 d-flex justify-content-center w-100 h-100'>
       <input
                        className='input2 mt-2 me-2 bar bg-white rounded-2'
                        placeholder='Search by  Name to show the transactions graph'
                        onChange={onSearchChange}
                    />
                     <button
                        onClick={onHandelSubmit}
                        className='btn btn-outline-info search text-white h-25  rounded-2'
                    >
                        search
                        
                    </button>
                    
                     
                </MDBInputGroup>
      <CustomerTable
        customers={customers}
        onCustomerSelect={handleCustomerSelect}  
      />
      {filteredTransactions.length > 0 ? (
        <TransactionGraph data={filteredTransactions} />
      ) : (
        <p>Select a customer to view their transactions</p>
      )}
    </div>
  );
}

export default App;
