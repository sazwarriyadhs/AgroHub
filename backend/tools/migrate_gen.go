package main

import (
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
)

func main() {
	modelDir := "./internal/models"

	fset := token.NewFileSet()

	pkgs, err := parser.ParseDir(fset, modelDir, nil, parser.AllErrors)
	if err != nil {
		panic(err)
	}

	var models []string

	for _, pkg := range pkgs {
		for _, file := range pkg.Files {
			for _, decl := range file.Decls {
				gen, ok := decl.(*ast.GenDecl)
				if !ok {
					continue
				}

				for _, spec := range gen.Specs {
					typeSpec, ok := spec.(*ast.TypeSpec)
					if !ok {
						continue
					}

					// ambil struct saja (lebih aman)
					if _, ok := typeSpec.Type.(*ast.StructType); ok {
						if ast.IsExported(typeSpec.Name.Name) {
							models = append(models, "&models."+typeSpec.Name.Name+"{}")
						}
					}
				}
			}
		}
	}

	fmt.Println("\n// =======================")
	fmt.Println("// AUTO GENERATED MODELS")
	fmt.Println("// =======================")

	fmt.Println("err = db.AutoMigrate(")
	for _, m := range models {
		fmt.Println("\t" + m + ",")
	}
	fmt.Println(")")
}