// utils/CrudService.js
import axios from '@/lib/axios';

export default class CrudService {
    constructor(resource) {
        this.resource = resource;
    }

    getAll = async () => {
        const res = await axios.get(`/api/${this.resource}`);
        return res.data;
    }

    getProductsWithPagination = async (page = 1) => {
        const res = await axios.get(`/api/${this.resource}/paginated?page=${page}`);
        return res.data;
    }

    getAllWithPagination = async (page = 1, query = "") => {
        const params = new URLSearchParams();
        params.append("page", page);
        if (query) params.append("query", query);

        const response = await axios.get(`/api/${this.resource}/paginated?${params.toString()}}`);
        return response.data;
    }

    getById = async (id) => {
        const res = await axios.get(`/api/${this.resource}/${id}`);
        return res.data;
    }

    create = async (data) => {
        const isFormData = data instanceof FormData;
        const res = await axios.post(
            `/api/${this.resource}/store`,
            data,
            isFormData ? {} : { headers: { 'Content-Type': 'application/json' } }
        );
        return res.data;
    }

    update = async (id, data) => {
        const isFormData = data instanceof FormData;
        const res = await axios.post(
            `/api/${this.resource}/${id}?_method=PUT`,
            data,
            isFormData ? {} : { headers: { 'Content-Type': 'application/json' } }
        );
        return res.data;
    }

    delete = async (id) => {
        const res = await axios.delete(`/api/${this.resource}/${id}`);
        return res.data;
    }

    export = async () => {
        const response = await axios.get(`/api/${this.resource}/pdf`, {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${this.resource}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
}
