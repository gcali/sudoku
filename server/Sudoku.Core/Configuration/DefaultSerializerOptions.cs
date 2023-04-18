using System.Text.Json;

namespace Sudoku.Core.Configuration
{
    public static class DefaultSerializerOptions
    {
        public static readonly JsonSerializerOptions DefaultOptions = SetOptions(new());

        public static JsonSerializerOptions SetOptions(JsonSerializerOptions options) {
            options.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
            options.PropertyNameCaseInsensitive = true;
            options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            return options;
        }
    }
}