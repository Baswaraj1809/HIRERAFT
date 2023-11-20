import React, { useState, useEffect } from 'react';
import { Table, Input, Select, Space, Pagination, Button, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const TableApp = () => {
  const [dataSource, setDataSource] = useState([]);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedGender, setSelectedGender] = useState('Filter');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [hideIdColumn, setHideIdColumn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        const modifiedData = response.data.map((user, index) => ({
          ...user,
          trips: index + 1, // Adding dummy trips data
          gender: index % 2 === 0 ? 'Male' : 'Female', // Adding dummy gender data
          city: index % 2 === 0 ? 'City A' : 'City B', // Adding dummy city data
        }));
        setDataSource(modifiedData);
        setFilteredDataSource(modifiedData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
    filterTable(value, selectedGender, 1);
  };

  const handleGenderChange = (value) => {
    setSelectedGender(value);
    filterTable(searchText, value, 1);
  };

  const handlePaginationChange = (page, pageSize) => {
    filterTable(searchText, selectedGender, page);
    setPagination({ current: page, pageSize });
  };

  const handleHideIdColumn = () => {
    setHideIdColumn(!hideIdColumn);
  };

  const filterTable = (search, gender, page) => {
    let filteredData = [...dataSource];

    if (search) {
      filteredData = filteredData.filter((record) =>
        Object.values(record).some(
          (val) =>
            val && val.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    if (gender && gender !== 'showall' && gender !== 'Filter') {
      filteredData = filteredData.filter((record) => record.gender === gender);
    }

    const startIndex = (page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    setFilteredDataSource(paginatedData);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      hidden: hideIdColumn,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Trips',
      dataIndex: 'trips',
      key: 'trips',
      width: 100,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      width: 100,
    },
  ];

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Row gutter={16} style={{ marginBottom: '16px' }}>
        <Col xs={24} sm={8}>
          <Input
            placeholder="Search"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Select
            placeholder="Filter Gender"
            style={{ width: '120px' }}
            onChange={handleGenderChange}
            value={selectedGender}
          >
            <Option value="Filter">Filter</Option>
            <Option value="showall">Show All</Option>
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
          </Select>
        </Col>
        <Col xs={24} sm={8}>
          <Button onClick={handleHideIdColumn}>
            {hideIdColumn ? 'Show ID Column' : 'Hide ID Column'}
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns.filter((column) => !column.hidden)}
        dataSource={filteredDataSource}
        pagination={{ ...pagination, key: Math.random() }}
        onChange={handlePaginationChange}
        style={{ marginBottom: '16px', borderRadius: '8px', overflow: 'hidden', width: '70%', margin: 'auto' }}
      />
      <Pagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={filteredDataSource.length}
        onChange={handlePaginationChange}
        style={{ marginTop: '16px' }}
      />
    </div>
  );
};

export default TableApp;
