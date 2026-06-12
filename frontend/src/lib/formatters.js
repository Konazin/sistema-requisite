const onlyDigits = (value) => value.replace(/\D/g, "");
export function formatCpf(value) {
    const digits = onlyDigits(value || "").slice(0, 11);
    return digits
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2");
}
export function maskCpf(value) {
    const digits = onlyDigits(value || "");
    if (digits.length < 11)
        return "CPF não informado";
    return `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**`;
}
export function formatWhatsapp(value) {
    const digits = onlyDigits(value || "").slice(0, 11);
    if (digits.length <= 10) {
        return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
    }
    return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}
export function formatCep(value) {
    return onlyDigits(value || "").slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2");
}
export function formatDate(value) {
    if (!value)
        return "Não informado";
    const date = new Date(value);
    if (Number.isNaN(date.getTime()))
        return "Data inválida";
    return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(date);
}
export function formatStatus(status) {
    const labels = {
        ACTIVE: "Ativo",
        PENDING_REVIEW: "Pendente de análise",
        INCOMPLETE: "Incompleto",
        BLOCKED: "Bloqueado",
        ARCHIVED: "Arquivado"
    };
    return labels[status || ""] || status || "Não informado";
}
export function statusTone(status) {
    if (status === "ACTIVE")
        return "success";
    if (status === "PENDING_REVIEW" || status === "INCOMPLETE")
        return "warning";
    if (status === "BLOCKED")
        return "danger";
    if (status === "ARCHIVED")
        return "neutral";
    return "brand";
}
