using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace AvaWeather;

public record APIRequest {
    public required string Url { get; set; }
    public HttpMethod Method { get; set; } = HttpMethod.Get;
    public object? Body { get; set; }
    public Dictionary<string, string>? Headers { get; set; }
    public Dictionary<string, string>? Query { get; set; }
}

public class API {
    private static readonly Lazy<API> _instance = new Lazy<API>(() => new API());
    public static API Instance => _instance.Value;

    private readonly HttpClient _httpClient;

    private API() {
        var handler = new HttpClientHandler() {
            CookieContainer = new CookieContainer()
        };
        _httpClient = new HttpClient(handler);
    }

    private static string AddQueryParamsToUrl(string url, Dictionary<string, string> queryParams) {
        var query = new StringBuilder(url.Contains('?') ? "&" : "?");

        foreach (var param in queryParams) {
            query.Append($"{Uri.EscapeDataString(param.Key)}={Uri.EscapeDataString(param.Value)}&");
        }

        return url + query.ToString().TrimEnd('&', '?');
    }

    private Task<HttpResponseMessage> DoHttpRequest(APIRequest requestParams) {
        var url = requestParams.Url;
        if (requestParams.Query != null) {
            url = AddQueryParamsToUrl(url, requestParams.Query);
        }

        var req = new HttpRequestMessage(requestParams.Method, url);

        if (requestParams.Headers != null) {
            foreach (var header in requestParams.Headers) {
                req.Headers.Add(header.Key, header.Value);
            }
        }

        if (requestParams.Body != null) {
            var json = JsonConvert.SerializeObject(requestParams.Body);
            req.Content = new StringContent(json, Encoding.UTF8, "application/json");
        }

        var res = _httpClient.SendAsync(req);
        return res;
    }

    public async Task<APIResponse> MakeRequest(APIRequest requestParams) {
        var res = await DoHttpRequest(requestParams);
        return new APIResponse(res);
    }

    public async Task<APIResponse<T>> MakeRequest<T>(APIRequest requestParams) {
        var res = await DoHttpRequest(requestParams);
        return new APIResponse<T>(res);
    }
}

public class APIResponse {
    private readonly HttpResponseMessage HttpResponse;

    public APIResponse(HttpResponseMessage res) {
        this.HttpResponse = res;

        var ms = new MemoryStream();
        res.Content.ReadAsStream().CopyTo(ms);
        Data = JsonConvert.DeserializeObject<JObject>(Encoding.UTF8.GetString(ms.ToArray()));

        Error = Data?.GetValue("error")?.Value<string>();
        if (Error == null && !res.IsSuccessStatusCode) {
            Error = $"Unknown error: {res.StatusCode.ToString()}";
        }
    }

    public HttpStatusCode StatusCode => HttpResponse.StatusCode;
    public HttpResponseHeaders Headers => HttpResponse.Headers;
    public HttpRequestMessage? Request => HttpResponse.RequestMessage;
    public bool Ok => HttpResponse.IsSuccessStatusCode;
    public JObject? Data;
    public string? Error;
}

public class APIResponse<T> : APIResponse {
    public new T? Data;

    public APIResponse(HttpResponseMessage res) : base(res) {
        if (base.Data != null) {
            try {
                Data = base.Data.ToObject<T>();
            }
            catch (Exception ex) {
                Console.WriteLine($"Generic APIResponse data could not be converted to T: {ex}");
            }
        }
    }
}