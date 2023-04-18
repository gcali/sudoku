FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY Sudoku.Api/*.csproj Sudoku.Api/
COPY Sudoku.Core/*.csproj Sudoku.Core/
COPY Sudoku.Infrastructure/*.csproj Sudoku.Infrastructure/
COPY *.sln ./
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out Sudoku.Api

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:5.0
RUN apt-get update && apt-get install -y apt-utils libgdiplus libc6-dev
RUN mkdir -p /var/logs/sudoku/
WORKDIR /app
COPY --from=build-env /app/out .
ENV ASPNETCORE_ENVIRONMENT=Production
ENTRYPOINT ["dotnet", "Sudoku.Api.dll"]

