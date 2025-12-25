import { useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { v4 as uuid } from 'uuid'
import { data } from '../../form.json'

export default function DynamicForm({ onClose, editableProduct, setEditableProduct, setProductDetails }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (editableProduct) {
            form.setFieldsValue(editableProduct)
        }
    }, [editableProduct])

    const productData = JSON.parse(localStorage.getItem('data')) || []

    const onFinish = (formData) => {
        if (!editableProduct) {
            const newData = [...productData, { id: uuid(), ...formData }]
            setProductDetails(newData)
            localStorage.setItem('data', JSON.stringify(newData))
        }
        else {
            const editData = {
                ...formData,
                id: editableProduct.id
            }
            const newData = productData.map((item) => {
                if (item.id === editableProduct.id) {
                    return editData
                }
                return item
            })
            setProductDetails(newData)
            localStorage.setItem('data', JSON.stringify(newData))
        }
        setEditableProduct(null)
        form.resetFields()
        onClose()
    }

    return (
        <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" form={form}>
            {data?.map((item) => {
                if (item.Type === "text" || item.Type === "email") {
                    return (
                        <Form.Item
                            key={item.id}
                            name={item.Name}
                            label={item.Field}
                            type={item.Type}
                        >
                            <Input />
                        </Form.Item>
                    )
                }
                else if (item.Type === "dropdown") {
                    return (
                        <Form.Item
                            key={item.id}
                            name={item.Name}
                            label={item.Field}
                            type={item.Type}
                        >
                            <Select options={item.Option} allowClear placeholder={`Please select ${item.Field}`} />
                        </Form.Item>
                    )
                }
            })}
            <Form.Item>
                <Button type="primary" htmlType='submit'>
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}