using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Components;
using NorthWind.Validation.Entities.Interfaces;
using NorthWind.Validation.Entities.ValueObjects;

namespace NorthWind.RazorComponents.Validators;

public class ModelValidator<T> : ComponentBase, IDisposable
{
    [CascadingParameter] public EditContext? EditContext { get; set; }
    [Parameter, EditorRequired] public IModelValidatorHub<T> Validator { get; set; } = default!;
    private ValidationMessageStore? validationMessageStore;

    private FieldIdentifier GetFieldIdentifier(object model, string propertyName)
    {
        char[] separators = ['.', '['];
        object currentModel = model;
        var propertyPath = propertyName;
        string? fieldName = null;
        int separatorIndex;
        string? token = null;
        do
        {
            separatorIndex = propertyPath.IndexOfAny(separators);
            if (separatorIndex >= 0)
            {
                token = propertyPath[..separatorIndex];
                propertyPath = propertyPath[(separatorIndex + 1)..];
                if (token.EndsWith(']'))
                {
                    token = token[..^1];
                    var indexer = currentModel.GetType().GetProperty("Item")!;
                    var indexerType = indexer.GetIndexParameters()[0].ParameterType;
                    var index = Convert.ChangeType(token, indexerType);
                    currentModel = indexer.GetValue(currentModel, [index])!;
                }
                else
                {
                    var property = currentModel.GetType().GetProperty(token)!;
                    currentModel = property.GetValue(currentModel)!;
                }
                token = null;
                fieldName = null;
            }
            else
            {
                fieldName = propertyPath;
            }
        } while (separatorIndex >= 0);
        return new FieldIdentifier(currentModel, token ?? fieldName ?? propertyPath);
    }

    public void AddErrors(IEnumerable<ValidationError> errors)
    {
        if (EditContext is null || validationMessageStore is null) return;
        validationMessageStore.Clear();
        foreach (var error in errors)
            validationMessageStore.Add(GetFieldIdentifier(EditContext.Model, error.PropertyName), error.Message);
        EditContext.NotifyValidationStateChanged();
    }

    private async void ValidationRequested(object? sender, ValidationRequestedEventArgs args)
    {
        if (EditContext is null || validationMessageStore is null) return;
        if (await Validator.Validate((T)EditContext.Model)) validationMessageStore.Clear();
        else AddErrors(Validator.Errors);
        EditContext.NotifyValidationStateChanged();
    }

    private async void FieldChanged(object? sender, FieldChangedEventArgs args)
    {
        if (EditContext is null || validationMessageStore is null) return;
        validationMessageStore.Clear(args.FieldIdentifier);
        if (!await Validator.Validate((T)EditContext.Model))
        {
            foreach (var error in Validator.Errors)
            {
                var field = GetFieldIdentifier(EditContext.Model, error.PropertyName);
                if (field.FieldName == args.FieldIdentifier.FieldName && field.Model == args.FieldIdentifier.Model)
                    validationMessageStore.Add(field, error.Message);
            }
        }
        EditContext.NotifyValidationStateChanged();
    }

    public override async Task SetParametersAsync(ParameterView parameters)
    {
        var previousContext = EditContext;
        await base.SetParametersAsync(parameters);
        if (EditContext is null || EditContext == previousContext) return;
        if (previousContext is not null)
        {
            previousContext.OnValidationRequested -= ValidationRequested;
            previousContext.OnFieldChanged -= FieldChanged;
        }
        validationMessageStore = new ValidationMessageStore(EditContext);
        EditContext.OnValidationRequested += ValidationRequested;
        EditContext.OnFieldChanged += FieldChanged;
    }

    public void Dispose()
    {
        if (EditContext is null) return;
        EditContext.OnValidationRequested -= ValidationRequested;
        EditContext.OnFieldChanged -= FieldChanged;
    }
}
