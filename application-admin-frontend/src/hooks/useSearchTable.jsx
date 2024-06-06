import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";

const useSearchTable = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const getNestedValue = (path, object) => path.reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : null, object);

    const getColumnSearchProps = (dataIndex, subDataIndex = null) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) => {
            const dataValue = subDataIndex ? getNestedValue([dataIndex, ...subDataIndex], record) : record[dataIndex];
            return dataValue ? dataValue.toString().toLowerCase().includes(value.toLowerCase()) : false;
        },
        onFilterDropdownOpenChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: text => searchedColumn === dataIndex ? (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ''}
            />
        ) : (
            text
        ),
    });

    return { getColumnSearchProps };
};

export default useSearchTable;
