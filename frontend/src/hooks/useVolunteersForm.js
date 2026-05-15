
import { useState, useEffect } from "react";
import { unmaskDigits } from "../lib/functions/unmask";
import { isNationalIdValid } from "../lib/validation/isNationalIdValid";

export const useVolunteerForm = (isOpen, mode, volunteerData, onSave, onClose) => {
    const initialState = {
        name: "", 
        gender: "", 
        nationalId: "", 
        phone: "", 
        phoneSecondary: "",
        hasWhatsApp: false, 
        hasWhatsAppSecondary: false, 
        street: "",
        number: "", 
        complement: "", 
        neighborhood: "", 
        city: "Presidente Prudente", 
        state: "SP",
    };

    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            setFormData((mode === 'edit' || mode === 'view') && volunteerData ? volunteerData : initialState);
            setErrors({});
        }
    }, [isOpen, mode, volunteerData]);

    const handleClose = () => {
        setFormData(initialState);
        setErrors({});
        onClose();
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let finalValue = type === "checkbox" ? checked : value;

        if (name === "nationalId") {
            finalValue = value.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2").slice(0, 14);
        }

        if (name === "phone" || name === "phoneSecondary") {
            finalValue = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{5})(\d)/, "$1-$2").slice(0, 15);
        }

        setFormData(prev => ({ ...prev, [name]: finalValue }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (formData.name.trim().split(/\s+/).length < 2) {
            newErrors.name = "Informe nome e sobrenome.";
        }

        const cleanId = unmaskDigits(formData.nationalId);
        if (cleanId.length === 11) {
            const idForLib = cleanId.replace(/(\d{9})(\d{2})/, "$1-$2");
            if (!isNationalIdValid(idForLib)) newErrors.nationalId = "CPF inválido.";
        } else if (cleanId.length < 7 || cleanId.length > 9) {
            newErrors.nationalId = "Documento inválido (insira CPF ou RG).";
        }

        if (unmaskDigits(formData.phone).length < 10) newErrors.phone = "Telefone principal inválido.";
        if (unmaskDigits(formData.phoneSecondary).length < 10) newErrors.phoneSecondary = "Telefone secundário inválido.";

        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            onSave(formData);
            handleClose();
        }
    };

    return { formData, errors, handleChange, handleSave, handleClose };
};