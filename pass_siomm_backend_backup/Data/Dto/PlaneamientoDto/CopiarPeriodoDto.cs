namespace pass_siomm_backend.Data.Dto.PlaneamientoDto
{
    public class CopiarPeriodoDto
    {
        public string anioOrigen { get; set; }
        public string mesOrigen { get; set; }
        public string anioDestino { get; set; }
        public string mesDestino { get; set; }
        public string fechaInicioOrigen { get; set; }
        public string fechaFinOrigen { get; set; }
        public string username { get; set; }
    }

    public class ApiResponse<T>
    {
        public bool success { get; set; }
        public string message { get; set; }
        public T data { get; set; }
    }
}
