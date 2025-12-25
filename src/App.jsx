import { useState, useMemo } from 'react';
import { Button, Drawer, Table, Space } from 'antd';
import DynamicForm from './component/DynamicForm';
import { data } from '../form.json'

function App() {
  const [open, setOpen] = useState(false)
  const [editableProduct, setEditableProduct] = useState(null)
  const [productDetails, setProductDetails] = useState(() => JSON.parse(localStorage.getItem('data')) || [])

  const showDrawer = () => setOpen(true)

  const onClose = () => setOpen(false)

  const columns = useMemo(() => data.map((item) => {
    const name = item.Name;
    const filteredData = productDetails?.filter((item) => item[name])

    return {
      title: item.Field,
      dataIndex: item.Name,
      key: item.id,
      filterMode: 'true',
      filterSearch: true,
      filters: filteredData?.map((item) => ({ text: item[name], value: item[name] })),
      onFilter: (value, record) => {
        const filteredValue = record[item.Name]
        return filteredValue?.startsWith(value)
      }
    }
  }), [productDetails])

  const handleDelete = (id) => {
    const newData = productDetails?.filter((item) => item.id !== id)
    setProductDetails(newData)
    localStorage.setItem('data', JSON.stringify(newData))
  }

  const handleEdit = (record) => {
    setEditableProduct(record)
    setOpen(true)
  }

  return (
    <>
      <Button type="primary" onClick={() => { showDrawer(); setEditableProduct(null) }}>
        Add Form
      </Button>
      <Drawer
        title="Add Form"
        open={open}
        onClose={onClose}
      >
        <DynamicForm onClose={onClose} editableProduct={editableProduct} setEditableProduct={setEditableProduct} setProductDetails={setProductDetails} productDetails={productDetails} />
      </Drawer>
      <Table
        dataSource={productDetails}
        columns={[...columns, {
          title: 'Action',
          key: 'action',
          render: (_, record) => {
            return (
              <Space>
                <Button type="primary" onClick={() => { handleDelete(record.id) }}>Delete</Button>
                <Button type="primary" onClick={() => { handleEdit(record) }}> Edit</Button>
              </Space >
            )
          }
        }]}
        pagination={{ pageSize: 5 }}
      />
    </>
  )
}

export default App
